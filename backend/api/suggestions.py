import os
from fastapi import APIRouter, HTTPException, Body
import google.generativeai as genai
from typing import List, Optional, Dict, Any
import json
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Configure Gemini API
GEMINI_API_KEY = "AIzaSyD5XGKbX8Mk2CYRaJgH1_gp02WKHdySuH0"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class TradeSuggestion(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    category: str = "general"
    status: str = "pending"
    created_at: Optional[datetime] = None

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[datetime] = None

class UserQuery(BaseModel):
    message: str
    context: Optional[dict] = None  # Additional context like current market conditions

class GenerateRequest(BaseModel):
    trades: List[Dict[str, Any]]

# In-memory storage (replace with database in production)
suggestions_db = []
chat_history = {}
suggestion_id_counter = 1

def extract_suggestions_from_text(text: str) -> List[Dict[str, str]]:
    """Extract structured suggestions from the model's text response."""
    suggestions = []
    current_suggestion = {}
    
    # Clean and split the text
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    for line in lines:
        if line.startswith("Title:"):
            # If we have a complete suggestion, add it to our list
            if "title" in current_suggestion and "description" in current_suggestion:
                suggestions.append(current_suggestion)
                current_suggestion = {}
            
            # Start a new suggestion
            current_suggestion["title"] = line.replace("Title:", "").strip()
            current_suggestion["category"] = "general"
            
        elif line.startswith("Description:") and "title" in current_suggestion:
            current_suggestion["description"] = line.replace("Description:", "").strip()
    
    # Add the last suggestion if complete
    if "title" in current_suggestion and "description" in current_suggestion:
        suggestions.append(current_suggestion)
    
    # If we couldn't parse structured suggestions, create a generic one from the text
    if not suggestions and text.strip():
        suggestions = [{
            "title": "Trading Insight",
            "description": text.strip()[:500],  # Limit length
            "category": "general"
        }]
    
    return suggestions

def analyze_trades(trades_data: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """Analyze trading data and generate suggestions."""
    if not trades_data:
        return []

    # Create a prompt for trade analysis
    prompt = """
    As an expert trading analyst, analyze the following trading data and provide 3-5 actionable insights and suggestions.
    Each suggestion should have a clear title and detailed description.

    Trading Data:
    """ + json.dumps(trades_data, indent=2) + """

    Please analyze:
    1. Pattern in winning trades
    2. Common mistakes in losing trades
    3. Risk management practices
    4. Trading setup effectiveness
    5. Market timing and entry/exit points

    Respond in this EXACT format (make sure to include the Title: and Description: prefixes):
    
    Title: [First suggestion title]
    Description: [Detailed explanation for first suggestion]
    
    Title: [Second suggestion title]
    Description: [Detailed explanation for second suggestion]
    
    Title: [Third suggestion title]
    Description: [Detailed explanation for third suggestion]
    """

    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        if not text_response or text_response.isspace():
            return [{
                "title": "No patterns detected",
                "description": "Not enough trade data to generate meaningful insights. Please add more trades.",
                "category": "general"
            }]
        
        # Extract structured suggestions from the text
        suggestions = extract_suggestions_from_text(text_response)
        
        # Ensure we have properly formatted suggestions
        for suggestion in suggestions:
            if "category" not in suggestion:
                suggestion["category"] = "general"
                
        return suggestions
        
    except Exception as e:
        print(f"Error generating suggestions: {str(e)}")
        return [{
            "title": "Analysis Error",
            "description": "We encountered an error while analyzing your trades. Please try again later.",
            "category": "error"
        }]

def generate_personalized_response(user_message: str, trades: List[dict], user_chat_history: List[ChatMessage]) -> str:
    """Generate a personalized response based on user's trading history and chat context."""
    if not trades:
        return "I don't have any trading data to analyze yet. Please add some trades first."

    # Create context from trade history
    winning_trades = sum(1 for t in trades if t.get('pnl', 0) > 0)
    losing_trades = sum(1 for t in trades if t.get('pnl', 0) < 0)
    avg_pnl = sum(float(t.get('pnl', 0)) for t in trades) / len(trades) if trades else 0
    
    trade_summary = f"""
    Trading History Summary:
    - Total Trades: {len(trades)}
    - Winning Trades: {winning_trades} ({(winning_trades/len(trades))*100:.1f}% win rate)
    - Losing Trades: {losing_trades}
    - Average PnL: {avg_pnl:.2f}
    """

    # Format previous conversation for context
    conversation_context = ""
    if user_chat_history:
        recent_history = user_chat_history[-5:]  # Get last 5 messages
        for msg in recent_history:
            conversation_context += f"{msg.role.upper()}: {msg.content}\n"

    # Create prompt for personalized response
    prompt = f"""
    You are a personalized trading assistant with access to the user's trading history.
    
    {trade_summary}
    
    Previous Conversation:
    {conversation_context}
    
    User Question: {user_message}
    
    Provide a helpful, personalized response that:
    1. References their specific trading performance
    2. Offers actionable advice based on their data
    3. Answers their question directly and comprehensively
    4. Uses a professional but friendly tone
    
    Response:
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return "I apologize, but I'm having trouble analyzing your trades right now. Please try again later."

@router.post("/chat")
async def chat_with_assistant(query: UserQuery, trades: List[Dict[str, Any]] = Body(default=[])):
    """Chat with the AI assistant about your trading."""
    try:
        # Get or initialize chat history for this session
        session_id = "default"  # In production, use a unique session ID
        if session_id not in chat_history:
            chat_history[session_id] = []

        # Add user message to chat history
        user_message = ChatMessage(
            role="user",
            content=query.message,
            timestamp=datetime.now()
        )
        chat_history[session_id].append(user_message)

        # Generate response
        response_text = generate_personalized_response(
            query.message,
            trades,
            chat_history[session_id]
        )

        # Add assistant response to chat history
        assistant_message = ChatMessage(
            role="assistant",
            content=response_text,
            timestamp=datetime.now()
        )
        chat_history[session_id].append(assistant_message)

        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history")
async def get_chat_history():
    """Get the chat history."""
    session_id = "default"
    if session_id not in chat_history:
        return {"history": []}
    return {"history": chat_history[session_id]}

@router.post("/generate")
async def generate_suggestions(request: Dict[str, Any] = Body(...)):
    """Generate trade suggestions based on trading history."""
    try:
        trades = request.get("trades", [])
        if not trades:
            raise HTTPException(status_code=400, detail="No trade data provided")

        suggestions = analyze_trades(trades)
        return {"suggestions": suggestions}
    except Exception as e:
        print(f"Error in generate_suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=TradeSuggestion)
async def create_suggestion(suggestion: TradeSuggestion):
    """Create a new suggestion manually."""
    global suggestion_id_counter
    suggestion.id = suggestion_id_counter
    suggestion.created_at = datetime.now()
    suggestions_db.append(suggestion)
    suggestion_id_counter += 1
    return suggestion

@router.get("/", response_model=List[TradeSuggestion])
async def get_suggestions():
    """Get all saved suggestions."""
    return suggestions_db

@router.get("/{suggestion_id}", response_model=TradeSuggestion)
async def get_suggestion(suggestion_id: int):
    """Get a specific suggestion by ID."""
    for suggestion in suggestions_db:
        if suggestion.id == suggestion_id:
            return suggestion
    raise HTTPException(status_code=404, detail="Suggestion not found")

@router.put("/{suggestion_id}", response_model=TradeSuggestion)
async def update_suggestion(suggestion_id: int, updated_suggestion: TradeSuggestion):
    """Update a specific suggestion by ID."""
    for i, suggestion in enumerate(suggestions_db):
        if suggestion.id == suggestion_id:
            updated_suggestion.id = suggestion_id
            suggestions_db[i] = updated_suggestion
            return updated_suggestion
    raise HTTPException(status_code=404, detail="Suggestion not found")

@router.delete("/{suggestion_id}")
async def delete_suggestion(suggestion_id: int):
    """Delete a specific suggestion by ID."""
    for i, suggestion in enumerate(suggestions_db):
        if suggestion.id == suggestion_id:
            suggestions_db.pop(i)
            return {"message": "Suggestion deleted successfully"}
    raise HTTPException(status_code=404, detail="Suggestion not found") 