import { inject } from "@angular/core"
import { Router } from "@angular/router"

export const redirectIfLogged = () => {
    const router = inject(Router)

    if (!localStorage.getItem("user_token")) {
        return true
    } else {
        router.navigate(["/ruta-privada"])
        return false
    }
}