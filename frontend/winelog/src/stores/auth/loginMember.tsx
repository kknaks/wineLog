'use client'

import { createContext, use, useState } from 'react'
import { useRouter } from 'next/navigation'
import client from '@/lib/backend/client'
import type { User } from '@/lib/types/user'

export const LoginMemberContext = createContext<{
  loginMember: User
  setLoginMember: (member: User) => void
  isLoginMemberPending: boolean
  isLogin: boolean
  logout: (callback: () => void) => void
  logoutAndHome: () => void
  checkLoginStatus: () => Promise<void>
}>({
  loginMember: {},
  setLoginMember: () => { },
  isLoginMemberPending: true,
  isLogin: false,
  logout: (callback: () => void) => { },
  logoutAndHome: () => { },
  checkLoginStatus: async () => { },
})

function createEmptyMember(): User {
  return {}
}

export function useLoginMember() {
  const router = useRouter()

  const [isLoginMemberPending, setLoginMemberPending] = useState(true)
  const [loginMember, _setLoginMember] = useState<User>(createEmptyMember())

  const removeLoginMember = () => {
    _setLoginMember(createEmptyMember())
    setLoginMemberPending(false)
  }

  const setLoginMember = (member: User) => {
    _setLoginMember(member)
    setLoginMemberPending(false)
  }

  const setNoLoginMember = () => {
    setLoginMemberPending(false)
  }

  // kakao_id나 nickname이 있으면 로그인된 상태로 판단
  const isLogin = !!(loginMember.kakao_id || loginMember.nickname)

  // 로그인 상태 확인 (백엔드에서 사용자 정보 가져오기)
  const checkLoginStatus = async () => {
    try {
      setLoginMemberPending(true)

      // 백엔드에서 현재 로그인된 사용자 정보 가져오기
      const { data, error } = await (client as any).GET('/api/v1/auth/me')

      if (error || !data) {
        removeLoginMember()
        return
      }

      setLoginMember(data as User)
    } catch (error) {
      console.error('로그인 상태 확인 오류:', error)
      removeLoginMember()
    }
  }

  const logout = (callback: () => void) => {
    (client as any).POST('/api/v1/auth/logout', {}).then(() => {
      removeLoginMember()
      callback()
    }).catch(() => {
      // 로그아웃 API 실패해도 클라이언트에서는 로그아웃 처리
      removeLoginMember()
      callback()
    })
  }

  const logoutAndHome = () => {
    logout(() => router.replace('/'))
  }

  return {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    logout,
    logoutAndHome,
    checkLoginStatus,
  }
}

export function useGlobalLoginMember() {
  return use(LoginMemberContext)
}
