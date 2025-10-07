import os
import time
import google.generativeai as genai
from datetime import datetime, timedelta
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans

# Configure Gemini API - Using environment variable is safer
# If using hardcoded key for development, consider rotating it regularly
API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyD5XGKbX8Mk2CYRaJgH1_gp02WKHdySuH0')
genai.configure(api_key=API_KEY)

# Rate limiting configuration
RATE_LIMIT = 60  # requests per minute
last_request_time = datetime.now()
request_count = 0

def check_rate_limit():
    global last_request_time, request_count
    current_time = datetime.now()
    
    # Reset counter if a minute has passed
    if (current_time - last_request_time) > timedelta(minutes=1):
        request_count = 0
        last_request_time = current_time
    
    # Check if we've exceeded the rate limit
    if request_count >= RATE_LIMIT:
        time.sleep(60)  # Wait for a minute
        request_count = 0
        last_request_time = datetime.now()
    
    request_count += 1

# Prompt templates
ANALYSIS_PROMPT = """
Analyze the following trading data and provide insights:
{trades}

Consider the following aspects:
1. Trading patterns and strategies
2. Risk management effectiveness
3. Market conditions and timing
4. Emotional factors from notes
5. Areas for improvement

Format the response as JSON with the following structure:
{
    "patterns": [
        {
            "title": "Pattern name",
            "description": "Pattern description",
            "success_rate": percentage
        }
    ],
    "insights": [
        "Insight 1",
        "Insight 2"
    ],
    "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
    ]
}
"""

CHAT_PROMPT = """
You are a trading assistant analyzing the following trading data:
{trades}

User question: {question}

Provide a detailed response focusing on:
1. Specific trade examples
2. Data-driven insights
3. Actionable recommendations
4. Risk management considerations
"""

ANALYTICS_PROMPT = """
Analyze the following trading data for advanced analytics:
{trades}

Calculate and provide:
1. Performance metrics
2. Risk metrics
3. Pattern recognition
4. Market correlation
5. Behavioral analysis

Format the response as JSON with the following structure:
{
    "metrics": {
        "win_rate": percentage,
        "profit_factor": number,
        "avg_trade_duration": "days",
        "max_drawdown": percentage,
        "sharpe_ratio": number
    },
    "patterns": [
        {
            "title": "Pattern name",
            "description": "Pattern description",
            "success_rate": percentage
        }
    ],
    "insights": [
        "Insight 1",
        "Insight 2"
    ]
}
"""

def analyze_trades(trades: List[Dict[str, Any]]) -> Dict[str, Any]:
    try:
        check_rate_limit()
        
        # Format trades for analysis - handle potential missing fields
        trades_text = ""
        try:
            trades_text = "\n".join([
                f"Date: {trade.get('date', 'N/A')}, Symbol: {trade.get('symbol', 'N/A')}, "
                f"Type: {trade.get('type', trade.get('trade_type', 'N/A'))}, "
                f"Entry: {trade.get('entryPrice', trade.get('entry_price', 'N/A'))}, "
                f"Exit: {trade.get('exitPrice', trade.get('exit_price', 'N/A'))}, "
                f"Size: {trade.get('positionSize', trade.get('position_size', 'N/A'))}, "
                f"PnL: {trade.get('pnl', 'N/A')}, "
                f"Notes: {trade.get('notes', 'N/A')}"
                for trade in trades
            ])
        except Exception as format_error:
            print(f"Error formatting trades for analysis: {str(format_error)}")
            trades_text = f"[Error formatting trades: {str(format_error)}]"
        
        print(f"Sending trades for analysis: {trades_text[:500]}...")
        
        # Generate analysis using Gemini
        model = genai.GenerativeModel('models/gemini-pro')
        response = model.generate_content(
            ANALYSIS_PROMPT.format(trades=trades_text)
        )
        
        print(f"Received analysis from Gemini: {response.text[:200]}...")
        return response.text
    except Exception as e:
        print(f"Error in analyze_trades: {str(e)}")
        error_message = str(e)
        if "API key not valid" in error_message or "API key expired" in error_message:
            return {
                "error": "The AI service API key appears to be invalid or expired.",
                "details": str(e)
            }
        elif "quota exceeded" in error_message.lower() or "rate limit" in error_message.lower():
            return {
                "error": "The AI service has reached its query limit.",
                "details": str(e)
            }
        else:
            return {
                "error": "Failed to analyze trades",
                "details": str(e)
            }

def chat_with_trades(trades: List[Dict[str, Any]], question: str) -> str:
    try:
        check_rate_limit()
        
        # Format trades for chat - handle potential missing fields
        trades_text = ""
        try:
            trades_text = "\n".join([
                f"Date: {trade.get('date', 'N/A')}, Symbol: {trade.get('symbol', 'N/A')}, "
                f"Type: {trade.get('type', trade.get('trade_type', 'N/A'))}, "
                f"Entry: {trade.get('entryPrice', trade.get('entry_price', 'N/A'))}, "
                f"Exit: {trade.get('exitPrice', trade.get('exit_price', 'N/A'))}, "
                f"Size: {trade.get('positionSize', trade.get('position_size', 'N/A'))}, "
                f"PnL: {trade.get('pnl', 'N/A')}, "
                f"Notes: {trade.get('notes', 'N/A')}"
                for trade in trades
            ])
        except Exception as format_error:
            print(f"Error formatting trades: {str(format_error)}")
            trades_text = f"[Error formatting trades: {str(format_error)}]"
        
        print(f"Sending question to Gemini: {question}")
        print(f"With trades data: {trades_text[:500]}...")
        
        # Generate chat response using Gemini
        model = genai.GenerativeModel('models/gemini-pro')
        response = model.generate_content(
            CHAT_PROMPT.format(trades=trades_text, question=question)
        )
        
        print(f"Received response from Gemini: {response.text[:200]}...")
        return response.text
    except Exception as e:
        print(f"Error in chat_with_trades: {str(e)}")
        error_message = str(e)
        if "API key not valid" in error_message or "API key expired" in error_message:
            return "The AI service API key appears to be invalid or expired. Please contact the administrator."
        elif "quota exceeded" in error_message.lower() or "rate limit" in error_message.lower():
            return "The AI service has reached its query limit. Please try again later."
        else:
            return f"Sorry, I encountered an error: {str(e)}. Please try again later."

def get_advanced_analytics(trades: List[Dict[str, Any]]) -> Dict[str, Any]:
    try:
        check_rate_limit()
        
        # Convert trades to DataFrame for analysis
        df = pd.DataFrame(trades)
        
        # Calculate basic metrics
        winning_trades = df[
            ((df['type'] == 'buy') & (df['exitPrice'] > df['entryPrice'])) |
            ((df['type'] == 'sell') & (df['exitPrice'] < df['entryPrice']))
        ]
        
        losing_trades = df[
            ((df['type'] == 'buy') & (df['exitPrice'] < df['entryPrice'])) |
            ((df['type'] == 'sell') & (df['exitPrice'] > df['entryPrice']))
        ]
        
        win_rate = (len(winning_trades) / len(df)) * 100 if len(df) > 0 else 0
        
        # Calculate profit factor
        gross_profit = winning_trades['exitPrice'].sum() - winning_trades['entryPrice'].sum()
        gross_loss = abs(losing_trades['exitPrice'].sum() - losing_trades['entryPrice'].sum())
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else float('inf')
        
        # Format trades for Gemini analysis
        trades_text = "\n".join([
            f"Date: {trade['date']}, Symbol: {trade['symbol']}, Type: {trade['type']}, "
            f"Entry: {trade['entryPrice']}, Exit: {trade['exitPrice']}, "
            f"Size: {trade['positionSize']}, Notes: {trade['notes']}"
            for trade in trades
        ])
        
        # Get insights from Gemini
        model = genai.GenerativeModel('models/gemini-pro')
        response = model.generate_content(
            ANALYTICS_PROMPT.format(trades=trades_text)
        )
        
        # Combine statistical and AI analysis
        result = {
            "metrics": {
                "win_rate": win_rate,
                "profit_factor": profit_factor,
                "total_trades": len(df),
                "winning_trades": len(winning_trades),
                "losing_trades": len(losing_trades)
            },
            "ai_analysis": response.text
        }
        
        return result
    except Exception as e:
        print(f"Error in get_advanced_analytics: {str(e)}")
        return {
            "error": "Failed to generate analytics",
            "details": str(e)
        } 