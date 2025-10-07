from flask import jsonify
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class AIService:
    def __init__(self):
        # Mock data for development
        self.mock_trades = [
            {
                'id': 1,
                'symbol': 'AAPL',
                'entry_price': 150.00,
                'exit_price': 155.00,
                'entry_date': datetime(2024, 1, 15, 9, 30),
                'exit_date': datetime(2024, 1, 15, 15, 30),
                'quantity': 100,
                'position_type': 'LONG'
            },
            {
                'id': 2,
                'symbol': 'MSFT',
                'entry_price': 300.00,
                'exit_price': 295.00,
                'entry_date': datetime(2024, 1, 14, 10, 0),
                'exit_date': datetime(2024, 1, 14, 14, 0),
                'quantity': 50,
                'position_type': 'SHORT'
            }
        ]

    def get_suggestions(self, user_id):
        # Use mock data for development
        recent_trades = self.mock_trades[:10]
        
        # Analyze trading patterns
        patterns = self._analyze_patterns(recent_trades)
        
        # Generate suggestions based on patterns
        suggestions = self._generate_suggestions(patterns)
        
        return jsonify({
            'suggestions': suggestions,
            'patterns': patterns
        }), 200

    def get_performance_metrics(self, user_id):
        # Use mock data for development
        trades = self.mock_trades
        
        # Calculate metrics
        total_trades = len(trades)
        winning_trades = len([t for t in trades if t['exit_price'] and t['exit_price'] > t['entry_price']])
        losing_trades = total_trades - winning_trades
        win_rate = (winning_trades / total_trades * 100) if total_trades > 0 else 0
        
        return jsonify({
            'total_trades': total_trades,
            'winning_trades': winning_trades,
            'losing_trades': losing_trades,
            'win_rate': win_rate
        }), 200

    def get_trading_patterns(self, user_id):
        # Use mock data for development
        trades = self.mock_trades
        
        # Analyze patterns
        patterns = self._analyze_patterns(trades)
        
        return jsonify({
            'patterns': patterns
        }), 200

    def _analyze_patterns(self, trades):
        # Simple pattern analysis
        patterns = {
            'winning_streaks': 0,
            'losing_streaks': 0,
            'average_hold_time': 0,
            'most_traded_symbols': {}
        }
        
        current_streak = 0
        is_winning = None
        
        for trade in trades:
            # Analyze streaks
            if trade['exit_price']:
                trade_result = trade['exit_price'] > trade['entry_price']
                if is_winning is None:
                    is_winning = trade_result
                    current_streak = 1
                elif trade_result == is_winning:
                    current_streak += 1
                else:
                    if is_winning:
                        patterns['winning_streaks'] = max(patterns['winning_streaks'], current_streak)
                    else:
                        patterns['losing_streaks'] = max(patterns['losing_streaks'], current_streak)
                    is_winning = trade_result
                    current_streak = 1
            
            # Analyze hold time
            if trade['exit_date'] and trade['entry_date']:
                hold_time = (trade['exit_date'] - trade['entry_date']).days
                patterns['average_hold_time'] += hold_time
            
            # Analyze symbols
            if trade['symbol'] in patterns['most_traded_symbols']:
                patterns['most_traded_symbols'][trade['symbol']] += 1
            else:
                patterns['most_traded_symbols'][trade['symbol']] = 1
        
        # Calculate averages
        if trades:
            patterns['average_hold_time'] /= len(trades)
        
        return patterns

    def _generate_suggestions(self, patterns):
        suggestions = []
        
        # Generate suggestions based on patterns
        if patterns['winning_streaks'] > 3:
            suggestions.append("You're on a winning streak! Consider taking some profits.")
        
        if patterns['losing_streaks'] > 2:
            suggestions.append("You've had some losses recently. Review your risk management.")
        
        if patterns['average_hold_time'] < 1:
            suggestions.append("You're trading very short-term. Consider longer positions for better risk/reward.")
        
        # Default suggestions
        if not suggestions:
            suggestions = [
                "Consider diversifying your portfolio across different sectors.",
                "Review your stop-loss strategy to minimize losses.",
                "Keep a trading journal to track your performance."
            ]
        
        return suggestions 