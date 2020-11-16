import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class HttpRequestParameters {
  private inner: Object;
  private constructor() {
    this.inner = new Object();
  }

  static Create(args: any[]): HttpRequestParameters {
    if (args.length % 2 != 0) {
      throw Error(`[HttpRequestParameters] invalid args count: ${args.length}. Must be able to be divided by 2.`);
    }
    let self = new HttpRequestParameters();
    for (let i = 0; i < args.length; i += 2) {
      self.set(args[i], args[i+1]);
    }
    return self;
  }

  set(key: string, value: string | number | boolean) {
    this.inner[key] = value.toString();
  }

  toUri(): string {
    let list = [];
    for (let key in this.inner) {
      list.push(`${key}=${encodeURIComponent(this.inner[key])}`);
    }
    return list.join('&');
  }
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  get(url: string) {
    return new Promise<any>((resolve, reject) => this.http.get(url)
      .subscribe(response =>
        resolve(response),
        error => reject(error)
      )
    );
  }

  post(url: string, args: any[]) {
    return new Promise<any>((resolve, reject) =>
      this.http.post(url, HttpRequestParameters.Create(args).toUri(), this.options)
        .subscribe(response =>
          resolve(response),
          error => reject(error)
        )
      );
  }
}
