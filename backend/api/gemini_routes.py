from flask import Blueprint, request, jsonify
from services.gemini_service import analyze_trades, chat_with_trades, get_advanced_analytics

gemini_bp = Blueprint('gemini', __name__)

@gemini_bp.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        trades = data.get('trades', [])
        
        if not trades:
            return jsonify({
                "error": "No trades provided",
                "status": "error"
            }), 400
        
        result = analyze_trades(trades)
        return jsonify({
            "result": result,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@gemini_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        trades = data.get('trades', [])
        question = data.get('question', '')
        
        if not trades or not question:
            return jsonify({
                "error": "Missing required fields",
                "status": "error"
            }), 400
        
        response = chat_with_trades(trades, question)
        return jsonify({
            "response": response,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@gemini_bp.route('/analytics', methods=['POST'])
def analytics():
    try:
        data = request.get_json()
        trades = data.get('trades', [])
        
        if not trades:
            return jsonify({
                "error": "No trades provided",
                "status": "error"
            }), 400
        
        result = get_advanced_analytics(trades)
        return jsonify({
            "result": result,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500 