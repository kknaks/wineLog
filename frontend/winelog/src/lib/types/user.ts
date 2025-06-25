// 백엔드 User 모델에 맞는 타입 정의
export type User = {
    id?: number
    kakao_id?: string
    email?: string | null
    nickname?: string
    profile_image?: string | null
    is_active?: boolean
    created_at?: string
    updated_at?: string
}
