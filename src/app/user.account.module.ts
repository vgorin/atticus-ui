import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';

@Injectable()
export class UserAccountModule {
  private backend_host = 'http://46.219.125.69:5000';

  public auth_user: string;
  public auth_pass: string;

  public email: string;
  public password: string;
  public verify_password: string;

  public name: string;
  public username: string;
  public legal_name: string;

  public country_code: string;
  public language_code: string;
  public timezone: string;

  private contracts: Array<Object>;

  constructor(private http: HttpClient, private storage: Storage) {
    console.log('UserAccountModule->constructor');
    this.country_code = 'US';
    this.language_code = 'eng';
    this.timezone = 'America/Los_Angeles';
  }

  public init() {
    return this._restore();
  }

  private _restore() {
    console.log('UserAccountModule -> _restore');
    return this.storage.get('user')
      .then( (str) => {
        const user = JSON.parse(str);
        console.log('RESTORED', str);

        this.auth_user = user.auth_user;
        this.auth_pass = user.auth_pass;
        this.email = user.email;
        this.password = user.password;
        this.verify_password = user.verify_password;
        this.name = user.name;
        this.username = user.username;
        this.legal_name = user.legal_name;
        this.country_code = user.country_code;
        this.language_code = user.language_code;
        this.timezone = user.timezone;
        this.contracts = user.contracts;

        if (!this.contracts) {
          return this.getContracts();
        }
      })
      .catch( (err) => {
        console.log('ERROR: UserAccountModule -> _restore', err);
      });
  }

  private _store() {
    return this.storage.set('user', JSON.stringify({
      auth_user : this.auth_user,
      auth_pass : this.auth_pass,
      email : this.email,
      password : this.password,
      verify_password : this.verify_password,
      name : this.name,
      username : this.username,
      legal_name : this.legal_name,
      country_code : this.country_code,
      language_code : this.language_code,
      timezone : this.timezone,
      contracts : this.contracts
    }));
  }

  private _request(sub_url, method, json, options) {
    if (!this.auth_user) {
      return this._restore().then( () => {
        return this._request(sub_url, method, json, options);
      });
    }
    const url = [
        this.backend_host.replace(/\/+$/, ''),
        sub_url.replace(/^\/+/, '')
    ].join('/');
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
    options.headers['Authorization'] = 'Basic ' + btoa(unescape(encodeURIComponent(this.auth_user + ':' + this.auth_pass)));
    options.headers['Content-Type'] = 'application/json';
    method = (method || 'get').toLowerCase();
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
          this._store();
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

  getUser(email, password) {
    console.log('UserAccountModule->getUser', email, password);
    this.auth_user = email || this.auth_user;
    this.auth_pass = password || this.auth_pass;
    return this._request('/account/auth/', 'get', null, null)
        .then(data => {
          this._update(data);
          return data;
        });
  }

  createUser() {
    const {email, username, password, legal_name, language_code, country_code, timezone} = this;
    const params = {email, username, password, legal_name, language_code, country_code, timezone};
    return this._request('/account', 'post', params, null)
        .then(data => {
          this._update(data);
          return data;
        });
  }

  getContracts() {
    return this._request('/contract/list/', 'get', null, null)
        .then(data => {
          this.contracts = data;
          return data;
        });
  }

  addContract(user, memo, body, to_account_id) {
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
            { account_id : to_account_id, contract_id },
          ];
          const deal_body = { account_id, title : memo, dialog, parties };
          return this._request('/deal/', 'post', deal_body, null);
        });
  }

  listDrafts() {
    return this._request('/contract/list?type=draft', 'get', null, null);
  }
}
