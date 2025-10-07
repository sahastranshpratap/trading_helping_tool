from flask import Blueprint, request, jsonify
from services.trade_service import TradeService

trades_bp = Blueprint('trades', __name__)
trade_service = TradeService()

@trades_bp.route('/', methods=['GET'])
def get_trades():
    # For development, use a default user ID
    user_id = 1
    return trade_service.get_trades(user_id)

@trades_bp.route('/', methods=['POST'])
def create_trade():
    # For development, use a default user ID
    user_id = 1
    data = request.get_json()
    return trade_service.create_trade(user_id, data)

@trades_bp.route('/<int:trade_id>', methods=['GET'])
def get_trade(trade_id):
    # For development, use a default user ID
    user_id = 1
    return trade_service.get_trade(user_id, trade_id)

@trades_bp.route('/<int:trade_id>', methods=['PUT'])
def update_trade(trade_id):
    # For development, use a default user ID
    user_id = 1
    data = request.get_json()
    return trade_service.update_trade(user_id, trade_id, data)

@trades_bp.route('/<int:trade_id>', methods=['DELETE'])
def delete_trade(trade_id):
    # For development, use a default user ID
    user_id = 1
    return trade_service.delete_trade(user_id, trade_id) 