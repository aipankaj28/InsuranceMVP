import os
import json
import google.genai as genai
from .schemas import PolicyExtractionResult, PolicyAddOn

class PolicyEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        
        self.client = genai.Client(api_key=api_key)
        # Use flash for speed and multimodal support
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    async def extract_details(self, file_content: bytes, filename: str, mime_type: str) -> PolicyExtractionResult:
        try:
            # Prepare multimodal prompt
            prompt = """
            You are an expert Indian insurance document parser. 
            Analyze the provided insurance policy document and extract details into a structured JSON format.
            
            Return ONLY a valid JSON object with the following fields:
            {
                "provider_name": "Name of insurance company",
                "policy_name": "Full name of the policy plan",
                "coverage_amount_val": numeric_value_of_sum_assured,
                "coverage_amount_str": "formatted_amount_in_rupees_e.g_10_Lakhs",
                "currency": "INR",
                "add_ons": [{"name": "Feature Name", "description": "Short explanation"}],
                "expiry_date": "YYYY-MM-DD or None",
                "premium_amount": numeric_premium_value,
                "is_valid_policy": true/false (false if it's not an insurance document),
                "confidence_score": 0.0 to 1.0,
                "raw_summary": "A 2-sentence summary of the policy"
            }
            
            IMPORTANT:
            - If "Sum Assured" or "Sum Insured" is found, use that for coverage_amount_val.
            - 1 Crore = 10,000,000.
            - 1 Lakh = 100,000.
            - If it's not an insurance policy, set is_valid_policy to false.
            """

            # Handle file for Gemini
            # In the new SDK, we use types.Part.from_bytes or similar but types is not explicitly imported above
            # Alternatively, we can just pass the data and mime_type in the parts list
            from google.genai import types
            
            content_part = types.Part.from_bytes(
                data=file_content,
                mime_type=mime_type
            )
            
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=[prompt, content_part]
            )
            response_text = response.text.strip()
            
            # Extract JSON from markdown if present
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()
            
            data = json.loads(response_text)
            data["filename"] = filename
            
            return PolicyExtractionResult(**data)
            
        except Exception as e:
            print(f"Error extracting from {filename}: {str(e)}")
            return PolicyExtractionResult(
                filename=filename,
                is_valid_policy=False,
                raw_summary=f"Error: {str(e)}",
                confidence_score=0.0
            )

policy_engine = PolicyEngine()
