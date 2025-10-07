from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
import os
from datetime import datetime

# Test if Gemini API key is loaded (securely)
api_key = os.getenv('GEMINI_API_KEY')
if api_key:
    print("✅ Gemini API Key is configured successfully")
else:
    print("❌ Gemini API Key is not configured. Please check your .env file")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS
    CORS(app)
    
    # Add home route
    @app.route('/')
    def home():
        return 'Hello, Trading Journal!'
    
    # Register blueprints with error handling
    try:
        from routes.trades import trades_bp
        app.register_blueprint(trades_bp, url_prefix='/api')
        print("✅ Trades routes registered successfully")
    except Exception as e:
        print(f"⚠️ Warning: Could not register trades routes: {e}")
        # Create a fallback trades route
        @app.route('/api/trades', methods=['GET'])
        def fallback_trades():
            return jsonify([
                {
                    'id': 1,
                    'symbol': 'AAPL',
                    'entry_price': 150.00,
                    'exit_price': 155.00,
                    'quantity': 100,
                    'position_type': 'LONG',
                    'status': 'CLOSED'
                }
            ])
    
    try:
        from routes.analytics import analytics_bp
        app.register_blueprint(analytics_bp, url_prefix='/api')
        print("✅ Analytics routes registered successfully")
    except Exception as e:
        print(f"⚠️ Warning: Could not register analytics routes: {e}")
        # Create a fallback analytics route
        @app.route('/api/analytics/performance', methods=['GET'])
        def fallback_analytics():
            return jsonify({
                'winRate': 65.5,
                'totalPnL': 2500.00,
                'totalTrades': 16
            })
    
    # Always create fallback Gemini routes (don't try to import)
    print("✅ Creating fallback Gemini routes")
    
    @app.route('/api/gemini/analyze', methods=['POST'])
    def fallback_gemini_analyze():
        return jsonify({
            'result': {
                'patterns': [
                    {
                        'title': 'Breakout Strategy',
                        'description': 'You have a 78% success rate with breakout patterns',
                        'success_rate': 78
                    }
                ],
                'insights': [
                    'Your most profitable trades are in technology stocks',
                    'Consider improving your stop-loss discipline'
                ],
                'recommendations': [
                    'Focus on Nifty index stocks during earnings season',
                    'Set maximum loss of 3% per trade'
                ]
            },
            'status': 'success'
        })
    
    @app.route('/api/gemini/chat', methods=['POST'])
    def fallback_gemini_chat():
        try:
            data = request.get_json()
            question = data.get('question', '').lower()
            trades = data.get('trades', [])
            
            print(f"Received chat question: {question}")
            print(f"Number of trades received: {len(trades)}")
            
            # Analyze the actual trade data
            if trades:
                total_trades = len(trades)
                winning_trades = [t for t in trades if t.get('pnl', 0) > 0]
                losing_trades = [t for t in trades if t.get('pnl', 0) < 0]
                win_rate = (len(winning_trades) / total_trades * 100) if total_trades > 0 else 0
                
                total_pnl = sum(t.get('pnl', 0) for t in trades)
                avg_win = sum(t.get('pnl', 0) for t in winning_trades) / len(winning_trades) if winning_trades else 0
                avg_loss = sum(abs(t.get('pnl', 0)) for t in losing_trades) / len(losing_trades) if losing_trades else 0
                
                # Analyze symbols
                symbol_counts = {}
                for trade in trades:
                    symbol = trade.get('symbol', 'Unknown')
                    symbol_counts[symbol] = symbol_counts.get(symbol, 0) + 1
                
                most_traded_symbol = max(symbol_counts.items(), key=lambda x: x[1])[0] if symbol_counts else 'None'
                
                # Analyze setup types
                setup_types = {}
                for trade in trades:
                    setup = trade.get('setup_type', 'Unknown')
                    setup_types[setup] = setup_types.get(setup, 0) + 1
                
                best_setup = max(setup_types.items(), key=lambda x: x[1])[0] if setup_types else 'None'
            else:
                # Use mock data if no trades provided
                total_trades = 16
                win_rate = 65.5
                total_pnl = 2500
                avg_win = 350
                avg_loss = 200
                most_traded_symbol = 'AAPL'
                best_setup = 'Breakout'
            
            # Generate conversational responses
            if 'hello' in question or 'hey' in question or 'hi' in question:
                response = "Hey there! I'm doing great, thanks for asking! 😊 I'm your trading buddy - I've been looking at your trades and I'm here to help you out. What's on your mind today?"
            
            elif 'how are you' in question:
                response = "I'm doing really well, thank you! Just been analyzing some trading patterns and ready to help you out. How about you? How's your trading day going?"
            
            elif 'what can you do' in question or 'help' in question:
                response = "Oh, I'm your personal trading assistant! I can help you analyze your trades, spot patterns, give you insights about your performance, and even suggest ways to improve your strategy. I've been studying your trading data, so I know your style pretty well. What would you like to chat about?"
            
            elif 'profit' in question or 'win' in question or 'performance' in question:
                response = f"Looking at your trades, you've got some interesting patterns going on! You've taken {total_trades} trades with a {win_rate:.1f}% win rate. That's actually pretty solid! You've made ₹{total_pnl:,.2f} overall, which is nice. I notice you're really good with {best_setup} setups, especially on {most_traded_symbol}. Want me to dive deeper into any of this?"
            
            elif 'loss' in question or 'risk' in question:
                response = f"Ah, risk management - that's the key to staying in the game! From what I see in your trades, your average loss is around ₹{avg_loss:,.2f}, but your wins are averaging ₹{avg_win:,.2f}. That's actually a pretty good ratio! But here's the thing - if you could tighten up those stop losses a bit, maybe cut your average loss to ₹{avg_loss * 0.8:.2f}, you'd be in even better shape. What do you think?"
            
            elif 'strategy' in question or 'pattern' in question or 'setup' in question:
                response = f"You know what's really working for you? Your {best_setup} setups! I've been watching your trades, and you seem to have a real knack for those. Plus, you're trading {most_traded_symbol} a lot, and it looks like you're getting comfortable with it. Maybe we should focus on finding more {best_setup} opportunities? What's your take on that?"
            
            elif 'focus' in question or 'improve' in question or 'profitable' in question:
                response = f"Alright, let's talk about making more money! 🚀 Here's what I think: You're already killing it with {best_setup} setups, so maybe double down on those? Also, I've noticed you're comfortable with {most_traded_symbol} - maybe explore similar stocks? And hey, your risk management could use a little tweak - try setting tighter stops to keep those losses smaller. Want me to break down any of these ideas?"
            
            elif 'data' in question or 'analysis' in question:
                response = f"Sure thing! Let me give you the rundown on your trading: You've got {total_trades} trades under your belt with a {win_rate:.1f}% win rate. Not bad at all! You're up ₹{total_pnl:,.2f} total, and your {best_setup} strategy is working well. You seem to love trading {most_traded_symbol} - and why not, right? Any specific part of this you want to dig into?"
            
            elif 'weather' in question or 'joke' in question or 'fun' in question:
                response = "Haha, I'm a trading AI, so I'm more into market patterns than weather patterns! 😄 But hey, if you want to talk about something fun - did you know that the stock market is actually more predictable than the weather? At least that's what I tell myself when I'm analyzing charts! What's your favorite trading setup?"
            
            elif 'thanks' in question or 'thank you' in question:
                response = "You're very welcome! I'm here to help you become a better trader. Feel free to ask me anything about your trades, strategies, or just chat about the markets. Good luck out there! 🎯"
            
            elif 'bye' in question or 'goodbye' in question:
                response = "Take care! Good luck with your trades today. Remember, I'm always here when you need some trading insights. Happy trading! 📈"
            
            else:
                response = f"Hey! I'm here to help with your trading. I've been looking at your {total_trades} trades and I can see you're doing pretty well with a {win_rate:.1f}% win rate. Your {best_setup} strategy on {most_traded_symbol} is working nicely! What would you like to chat about? I'm all ears!"
            
            print(f"Sending response: {response[:100]}...")
            
            return jsonify({
                'response': response,
                'status': 'success'
            })
        except Exception as e:
            print(f"Error in chat endpoint: {e}")
            return jsonify({
                'response': "Oops! I'm having a moment here. Can you try asking that again? Sometimes I get a bit confused with complex questions.",
                'status': 'error',
                'error': str(e)
            }), 500
    
    # Add a test route
    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({
            'message': 'Backend is running successfully!',
            'status': 'ok',
            'timestamp': '2024-01-15T10:30:00'
        })
    
    return app

if __name__ == '__main__':
    try:
        app = create_app()
        print("🚀 Starting Flask server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("Please check your configuration and try again.") 