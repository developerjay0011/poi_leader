
import { USER_TYPE, USER_VERIFY, TOKEN_KEY } from '@/constants/common';
import { NextRequest, NextResponse } from 'next/server';
import { AuthRoutes, EmployeeProtectedRoutes, ProtectedRoutes } from './constants/routes';

export function middleware(request: NextRequest) {
  let user_types = request.cookies.getAll()
  let token = user_types?.find((x: any) => x.name === TOKEN_KEY)?.value || '';
  let isuserverify = user_types?.find((x: any) => x.name === USER_VERIFY)?.value || '';
  let user_type = user_types?.find((x: any) => x.name === USER_TYPE)?.value || '';

  let pathname = request.nextUrl.pathname;
  const routeList = Object.values(ProtectedRoutes);
  const employeerouteList = Object.values(EmployeeProtectedRoutes);
  const authRouteList = Object.values(AuthRoutes);
  if (isuserverify != "true" && !token && ((routeList.includes(pathname) && user_type == "leader") || (employeerouteList.includes(pathname) && user_type == "employee"))) {
    const response = NextResponse.redirect(new URL(`/`, request.url));
    return response;
  }
  if (isuserverify == "true" && token && (authRouteList.includes(pathname) || pathname.includes('/employee-access')) && user_type == "leader") {
    const response = NextResponse.redirect(new URL(ProtectedRoutes.user, request.url));
    return response;
  }
  if (isuserverify == "true" && token && (authRouteList.includes(pathname) || pathname.includes('/user')) && user_type == "employee") {
    const response = NextResponse.redirect(new URL(EmployeeProtectedRoutes.employee, request.url));
    return response;
  }
}
