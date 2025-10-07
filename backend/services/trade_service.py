from flask import jsonify
from datetime import datetime
import random

class TradeService:
    def __init__(self):
        # Mock data for development
        self.mock_trades = [
            {
                'id': 1,
                'symbol': 'AAPL',
                'entry_date': '2024-01-15T09:30:00',
                'exit_date': '2024-01-15T15:30:00',
                'entry_price': 150.00,
                'exit_price': 155.00,
                'quantity': 100,
                'position_type': 'LONG',
                'status': 'CLOSED',
                'notes': 'Breakout trade on earnings'
            },
            {
                'id': 2,
                'symbol': 'MSFT',
                'entry_date': '2024-01-14T10:00:00',
                'exit_date': '2024-01-14T14:00:00',
                'entry_price': 300.00,
                'exit_price': 295.00,
                'quantity': 50,
                'position_type': 'SHORT',
                'status': 'CLOSED',
                'notes': 'Reversal trade'
            }
        ]

    def get_trades(self, user_id):
        return jsonify(self.mock_trades), 200

    def create_trade(self, user_id, data):
        new_trade = {
            'id': len(self.mock_trades) + 1,
            'symbol': data['symbol'],
            'entry_date': data['entry_date'],
            'exit_date': data.get('exit_date'),
            'entry_price': data['entry_price'],
            'exit_price': data.get('exit_price'),
            'quantity': data['quantity'],
            'position_type': data['position_type'],
            'status': 'OPEN',
            'notes': data.get('notes', '')
        }
        
        self.mock_trades.append(new_trade)
        
        return jsonify({
            'id': new_trade['id'],
            'message': 'Trade created successfully'
        }), 201

    def get_trade(self, user_id, trade_id):
        trade = next((t for t in self.mock_trades if t['id'] == trade_id), None)
        if not trade:
            return jsonify({'error': 'Trade not found'}), 404
            
        return jsonify(trade), 200

    def update_trade(self, user_id, trade_id, data):
        trade = next((t for t in self.mock_trades if t['id'] == trade_id), None)
        if not trade:
            return jsonify({'error': 'Trade not found'}), 404
            
        for key, value in data.items():
            if key in trade:
                trade[key] = value
                    
        return jsonify({'message': 'Trade updated successfully'}), 200

    def delete_trade(self, user_id, trade_id):
        trade = next((t for t in self.mock_trades if t['id'] == trade_id), None)
        if not trade:
            return jsonify({'error': 'Trade not found'}), 404
            
        self.mock_trades = [t for t in self.mock_trades if t['id'] != trade_id]
        return jsonify({'message': 'Trade deleted successfully'}), 200 