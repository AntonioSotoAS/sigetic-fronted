import { AuthGuard } from "@/components/auth-guard"

export default function Home() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/login">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bienvenido a SIGETIC</h1>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    </AuthGuard>
  )
}
