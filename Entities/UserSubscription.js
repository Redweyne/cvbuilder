{
  "name": "UserSubscription",
  "type": "object",
  "properties": {
    "plan": {
      "type": "string",
      "enum": [
        "free",
        "pro",
        "enterprise"
      ],
      "default": "free"
    },
    "status": {
      "type": "string",
      "enum": [
        "active",
        "cancelled",
        "expired",
        "trial"
      ],
      "default": "active"
    },
    "ai_credits_used": {
      "type": "number",
      "default": 0
    },
    "ai_credits_limit": {
      "type": "number",
      "default": 5
    },
    "exports_used": {
      "type": "number",
      "default": 0
    },
    "exports_limit": {
      "type": "number",
      "default": 3
    },
    "trial_end_date": {
      "type": "string",
      "format": "date"
    },
    "billing_cycle": {
      "type": "string",
      "enum": [
        "monthly",
        "yearly"
      ]
    },
    "next_billing_date": {
      "type": "string",
      "format": "date"
    }
  },
  "required": []
}