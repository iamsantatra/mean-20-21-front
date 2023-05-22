import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenStorageService } from "../shared/token-storage.service";
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private token: TokenStorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let authRequest = req;
        const authToken = this.token.getToken();
        if(authToken) {
            authRequest = req.clone({
                headers: req.headers.set(TOKEN_HEADER_KEY, "Bearer "+ authToken)
        });
        }
        console.log(authToken)
        console.log(authRequest)
        return next.handle(authRequest)
    }
}
