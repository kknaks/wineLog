import os
import json
import google.generativeai as genai
from fastapi import UploadFile
from typing import List
from core.config import settings
from PIL import Image
import io
from pydantic import BaseModel, Field
from schemas.diary import WineTasteRequest

class WineInfo(BaseModel):
    name: str = Field(default="")
    grape: str = Field(default="")
    origin: str = Field(default="")
    year: str = Field(default="")
    type: str = Field(default="")
    alcohol: str = Field(default="")

async def analyze_wine_images(image_files: List[UploadFile]):
    """
    Gemini를 사용하여 와인 이미지 2장을 분석하는 함수
    """
    try:
        print("\n=== 와인 이미지 분석 시작 ===")
        print(f"받은 이미지 개수: {len(image_files)}")

        # 이미지 데이터 준비
        image_parts = []
        for idx, file in enumerate(image_files):
            print(f"\n이미지 {idx+1} 읽기 시작...")
            contents = await file.read()
            print(f"이미지 {idx+1} 크기:", len(contents), "bytes")
            
            # 바이너리 데이터를 PIL Image로 변환
            image = Image.open(io.BytesIO(contents))
            
            # RGBA 이미지를 RGB로 변환 (필요한 경우)
            if image.mode == 'RGBA':
                image = image.convert('RGB')
            
            # 이미지를 바이트로 다시 변환
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format=image.format or 'JPEG')
            img_byte_arr = img_byte_arr.getvalue()
            
            image_parts.append({
                'mime_type': 'image/jpeg',
                'data': img_byte_arr
            })
            await file.seek(0)

        print("\nGemini 모델 생성 중...")
        model = genai.GenerativeModel(settings.llm_model)

        # 프롬프트 작성
        prompt = """
        당신은 전문 와인 소믈리에입니다. 이 와인 병 이미지들을 분석하여 와인에 대한 한국어로 상세 정보를 제공해주세요.
        와인 병 이미지는 와인 병의 앞면과 뒷면 두 장입니다.
        확인이 안되는 부분은 반드시 빈 문자열("")로 응답해주세요. null이나 undefined는 사용하지 마세요.
        
        다음 정보들을 추출해주세요:
        - 와인 이름(라벨지에 입력된 원문)
        - 포도 품종(한국어로)
        - 원산지 (국가 및 지역)
        - 생산 연도(숫자)
        - 종류 (red, white, sparkling, rose, icewine, natural, dessert)
        - 도수 (숫자로 예: 13.5)

        아래의 JSON 형식으로 응답해주세요:
        {
            "name": "와인 이름",
            "grape": "포도 품종",
            "origin": "원산지",
            "year": "생산 연도",
            "type": "red, white, sparkling, rose, icewine, natural, dessert",
            "alcohol": "도수 (숫자로 예: 13.5)"
        }

        JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요.
        """

        print("\nGemini API 호출 시작...")
        response = model.generate_content([prompt, *image_parts])
        print("Gemini API 응답 받음")
        
        # JSON 문자열 추출 및 파싱
        json_str = response.text.strip('`json\n').strip('`')  # 백틱과 'json' 태그 제거
        wine_info = WineInfo.parse_raw(json_str)
        
        return {
            "success": True,
            "analysis": {
                "wine_analysis": wine_info.dict()
            }
        }

    except Exception as e:
        print("\n!!! 에러 발생 !!!")
        print("에러 타입:", type(e).__name__)
        print("에러 메시지:", str(e))
        print("=== 와인 이미지 분석 실패 ===\n")
        return {
            "success": False,
            "error": f"{type(e).__name__}: {str(e)}"
        }

async def analyze_wine_taste(request: WineTasteRequest):
    """
    Perplexity AI를 사용하여 와인의 테이스팅 노트를 분석하는 함수
    """
    try:
        from openai import OpenAI
        
        print("\n=== 와인 테이스팅 노트 분석 시작 ===")
        print(f"입력 데이터: {request.dict()}")
        
        client = OpenAI(
            api_key=settings.perplexity_api_key,
            base_url="https://api.perplexity.ai"
        )

        messages = [
            {
                "role": "system",
                "content": (
                    "당신은 전문 와인 소믈리에입니다. "
                    "주어진 와인 정보를 분석하여 상세한 테이스팅 노트를 제공해주세요. "
                    "각 특성은 '꽃향, 과일향, 트러플향' 같은 형식으로 쉼표로 구분하여 나열해주세요."
                    "반드시 JSON 형식으로 응답해주세요."
                )
            },
            {
                "role": "user",
                "content": (
                    f"와인 이름: {request.name or '정보 없음'}\n"
                    f"원산지: {request.origin or '정보 없음'}\n"
                    f"포도 품종: {request.grape or '정보 없음'}\n"
                    f"생산 연도: {request.year or '정보 없음'}\n"
                    f"종류: {request.type or '정보 없음'}\n\n"
                    "다음 형식의 JSON으로 응답해주세요:\n"
                    "{\n"
                    '  "aroma": "향에 대한 태그형식의 간결한 설명 (예: 꽃향, 과일향, 트러블향 등)",\n'
                    '  "taste": "맛에 대한 태그형식의 간결한 설명 (예: 달콤, 산미, 탄닌 등)",\n'
                    '  "finish": "피니시에 대한 태그형식의 간결한 설명 (예: 길고 가벼운, 짧고 강한 등)",\n'
                    '  "sweetness": 0-5 사이의 숫자,\n'
                    '  "acidity": 0-5 사이의 숫자,\n'
                    '  "tannin": 0-5 사이의 숫자,\n'
                    '  "body": 0-5 사이의 숫자,\n'
                    "}"
                )
            }
        ]

        print("\nAPI 요청 보내는 중...")
        response = client.chat.completions.create(
            model="sonar-pro",
            messages=messages
        )
        print("\nAPI 응답 받음:")
        print("전체 응답 객체:", response)
        print("\n응답 내용:", response.choices[0].message.content)

        # content에서 JSON 문자열 찾기
        content = response.choices[0].message.content.strip()
        print("\n정제된 content:", content)
        
        # JSON 부분만 추출 (중괄호로 둘러싸인 부분)
        json_str = content[content.find("{"):content.rfind("}")+1]
        print("\n추출된 JSON 문자열:", json_str)
        
        result = json.loads(json_str)
        print("\n파싱된 JSON:", result)

        final_result = {
            "success": True,
            "tastingNote": {
                "aroma": result.get("aroma", ""),
                "taste": result.get("taste", ""),
                "finish": result.get("finish", ""),
                "sweetness": result.get("sweetness", 50),
                "acidity": result.get("acidity", 50),
                "tannin": result.get("tannin", 50),
                "body": result.get("body", 50),
            }
        }
        print("\n최종 결과:", final_result)
        print("=== 와인 테이스팅 노트 분석 완료 ===\n")
        return final_result

    except Exception as e:
        print("\n!!! 테이스팅 노트 분석 중 에러 발생 !!!")
        print("에러 타입:", type(e).__name__)
        print("에러 메시지:", str(e))
        print("API 응답:", response.choices[0].message.content if 'response' in locals() else "응답 없음")
        print("=== 와인 테이스팅 노트 분석 실패 ===\n")
        return {
            "success": False,
            "error": f"{type(e).__name__}: {str(e)}"
        }
    