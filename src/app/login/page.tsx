import { GalleryVerticalEnd } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-4" />
              </div>
              SIGETIC
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
                              <div className="w-full max-w-xs space-y-6">
                    <LoginForm />
                  </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center overflow-hidden py-8" style={{ backgroundColor: 'rgb(247, 247, 247)' }}>
          <Image
            src="/img/login/fondo-login.png"
            alt="Imagen de fondo del login"
            width={620}
            height={620}
            className="object-contain max-h-[calc(100%-4rem)]"
          />
        </div>
      </div>
    </AuthGuard>
  )
}
