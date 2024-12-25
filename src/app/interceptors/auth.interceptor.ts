import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { GeneralService } from '../services/general.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private generalService: GeneralService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      console.log('we are intercepting', request)

        let data = this.getToken();
        if (((request.url.includes("cast")) || (request.url.includes("onrender"))) && data ) {
            let setHeaders =  {}


            if (data.jwtToken) setHeaders = { ...setHeaders, "Authorization": data.jwtToken }
            if(data.clientId) setHeaders = { ...setHeaders, "ClientID": data.clientId }
            request = request.clone({
                setHeaders
            });
        }
        return next.handle(request).pipe(
            catchError((error) => {
                if (error.status === 403) {
                    // this.generalService.logoutUser();
                    return throwError(() => ({
                        statusCode: 403,
                        message: 'Your session has expired. Please login to continue.'
                    }));
                }
                else {
                    return throwError(() => ({
                        statusCode: 500,
                        message: error
                    }));
                }
            })
        );

    }

    getToken() {
        console.log('gettingToken')
        return this.generalService.getToken();
    }
}
