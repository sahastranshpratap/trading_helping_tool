from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from datetime import datetime, timedelta
import random

analytics_bp = Blueprint('analytics', __name__)
ai_service = AIService()

@analytics_bp.route('/performance', methods=['GET'])
def get_performance():
    # For development, use a default user ID
    user_id = 1
    return ai_service.get_performance_metrics(user_id)

@analytics_bp.route('/suggestions', methods=['GET'])
def get_suggestions():
    # For development, use a default user ID
    user_id = 1
    return ai_service.get_suggestions(user_id)

@analytics_bp.route('/patterns', methods=['GET'])
def get_trading_patterns():
    # For development, use a default user ID
    user_id = 1
    return ai_service.get_trading_patterns(user_id)

@analytics_bp.route('/trade-activity', methods=['GET'])
def get_trade_activity():
    time_range = request.args.get('timeRange', '1M')
    
    # Generate mock data for development
    recent_trades = [
        {
            'id': 1,
            'symbol': 'AAPL',
            'trade_type': 'LONG',
            'entry_price': 150.00,
            'exit_price': 155.00,
            'pnl': 500.00,
            'exit_date': '2024-01-15T10:30:00'
        },
        {
            'id': 2,
            'symbol': 'MSFT',
            'trade_type': 'SHORT',
            'entry_price': 300.00,
            'exit_price': 295.00,
            'pnl': 250.00,
            'exit_date': '2024-01-14T14:20:00'
        }
    ]

    # Mock trade volume data
    trade_volume = [
        {'date': '2024-01-15', 'trades': 3},
        {'date': '2024-01-14', 'trades': 2},
        {'date': '2024-01-13', 'trades': 1}
    ]

    session_distribution = [
        {'session': 'Morning', 'trades': 5},
        {'session': 'Afternoon', 'trades': 8},
        {'session': 'Evening', 'trades': 3}
    ]

    calendar_events = [
        {
            'title': 'AAPL (+500)',
            'start': '2024-01-15T10:30:00',
            'end': '2024-01-15T10:30:00',
            'pnl': 500
        },
        {
            'title': 'MSFT (+250)',
            'start': '2024-01-14T14:20:00',
            'end': '2024-01-14T14:20:00',
            'pnl': 250
        }
    ]

    return jsonify({
        'recentTrades': recent_trades,
        'tradeVolume': trade_volume,
        'sessionDistribution': session_distribution,
        'calendarEvents': calendar_events
    })

@analytics_bp.route('/performance-metrics', methods=['GET'])
def get_performance_metrics():
    time_range = request.args.get('timeRange', '1M')
    
    # Mock performance metrics for development
    return jsonify({
        'winRate': 65.5,
        'totalPnL': 2500.00,
        'pnlChange': 2.5,
        'riskRewardRatio': 1.8,
        'equityCurve': [
            {'date': '2024-01-13', 'value': 100000},
            {'date': '2024-01-14', 'value': 102500},
            {'date': '2024-01-15', 'value': 102500}
        ],
        'metrics': {
            'totalTrades': 16,
            'winningTrades': 10,
            'losingTrades': 6,
            'averageWin': 350.00,
            'averageLoss': 200.00
        }
    }) 