import { HttpClient } from '@angular/common/http';

export class UserAccount {
  private backend_url = 'http://192.168.1.236:28081';

  public email: string;
  public password: string;
  public verify_password: string;

  public name: string;
  public username: string;
  public legal_name: string;

  public country_code: string;
  public language_code: string;
  public timezone: string;

  constructor(private http: HttpClient) {
    this.country_code = 'US';
    this.language_code = 'eng';
    this.timezone = 'America/Los_Angeles';
  }

  private _request(sub_url, method, json, options) {
    const url = [this.backend_url, sub_url].join('/')
        .replace(/([^:])\/{2,}/g, '$1/');
    let args = [url];
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.headers['Content-Type']) {
      options.headers['Content-Type'] = {};
    }
    options.headers['Content-Type'] = 'application/json';
    method = method.toLowerCase();
    switch (method) {
      case 'get' : {
        args = args.concat([options]);
        break;
      }
      case 'post' : {
        args = args.concat([json, options]);
        break;
      }
    }
    if (!this.http[method]) {
      console.log('Error: No such HTTP method :', {url, method, json, options});
    }
    return this.http[method].apply(this.http, args)
        .toPromise()
        .then((response) => {
          if ((response.error || {}).message) {
            throw new Error([
              response.error.code,
              response.error.message
            ].join(': '));
          }
          console.log('HTTP_RESPONSE:', {method, args, options, response});
          return response;
        })
        .catch((error) => {
          console.log('HTTP_ERROR:', {method, args, options, error});
          throw(error);
        });
  }

  private _update(user_data) {
    if (!user_data) {
      return null;
    }
    const ok = Object.keys(user_data);
    for (let i = 0; i < ok.length; i++) {
      this[ok[i]] = user_data[ok[i]];
    }
  }

  private _clearPass() {
    this.password = '';
    this.verify_password = '';
  }

  getUser() {
    return this._request('/account/email/'+this.email, 'get', null, null)
        .then(data => {
          this._update(data);
          this._clearPass();
          return data;
        });
  }

  createUser() {
    const {email, username, password, legal_name, language_code, country_code, timezone} = this;
    const params = {email, username, password, legal_name, language_code, country_code, timezone};
    return this._request('/account', 'post', params, null)
        .then(data => {
          this._update(data);
          this._clearPass();
          return data;
        });
  }

  getContracts(user) {
    return this._request('/contract/list/' + user.account_id, 'get', null, null)
        .then(data => {
          return data;
        });
  }

  addContract(user, memo, body, to_user) {
    console.log('addContract', arguments);
    const { account_id } = user;
    const contract_body = { account_id, memo, body };
    return this._request('/contract/', 'post', contract_body, null)
        .then(data => {
          console.log('addContract-data', data);
          const { contract_id } = data;
          const dialog = [
            { account_id, contract_id }
          ];
          const parties = [
            { account_id, contract_id },
            { account_id : to_user.account_id, contract_id },
          ];
          const deal_body = { account_id, title : memo, dialog, parties };
          return this._request('/deal/', 'post', deal_body, null);
        });
  }
}
