import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {  NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const _NgxSpinnerService = inject(NgxSpinnerService)

  // Show the spinner before the request is sent
  _NgxSpinnerService.show('loading');
  // Hide the spinner after the request is completed


  return next(req).pipe(finalize(() => {
    _NgxSpinnerService.hide('loading');
  }));

  


};
