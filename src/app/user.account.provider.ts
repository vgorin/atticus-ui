import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';

@Injectable()
export class UserAccount {
  private backend_host = 'http://172.104.123.14:28081';

  public check_user: boolean;

  public auth;

  public account_id: string;

  public email: string;
  public password: string;
  public verify_password: string;

  public name: string;
  public username: string;
  public legal_name: string;

  public country_code: string;
  public language_code: string;
  public timezone: string;

  public drafts;
  public templates;
  public proposals;
  private contracts;

  public dealToView;

  public user;

  constructor(private http: HttpClient, private storage: Storage) {
    console.log('UserAccount->constructor');
    this.country_code = 'US';
    this.language_code = 'eng';
    this.timezone = 'America/Los_Angeles';
    this.auth = {};
    this.drafts = [];
    this.templates = [];
    this.proposals = [];
    this.contracts = [];
    this.dealToView = {};
  }

  async init() {
    this.user = await this.getUser();
  }

  public newTemplatesCount(): number {
    return this.templates? this.templates.length: 0;
  }

  public newDraftsCount(): number {
    return this.drafts? this.drafts.length: 0;
  }

  public newProposalsCount(): number {
    return this.proposals? this.proposals.length: 0;
  }

  public newActiveDealsCount(): number {
    return this.contracts? this.contracts.length: 0;
  }

  private _request(sub_url, method, json, options) {
    return this
      .storage.get('auth')
      .then( (auth) => {
        // if register
        if ( /post/i.test(method) && /\/account/i.test(sub_url) ) {
          this.auth = {};
          return null;
        }

        if ( !(auth || {}).email ) {
          throw(new Error('NOT_LOGGED_IN1'));
        }
        this.auth = auth;
        if (!this.account_id) {
          // throw(new Error('NOT_LOGGED_IN2'));
          if (!this.check_user) {
            return this.logIn();
          }
        }
      })
      .then( () => {
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
        // todo - http.useBasicAuth(username, password)
        if ( this.auth.email ) {
          options.headers['Authorization'] = 'Basic ' + btoa(
              unescape(encodeURIComponent(this.auth.email + ':' + this.auth.password))
          );
        }
        options.headers['Content-Type'] = 'application/json';
        method = (method || 'get').toLowerCase();
        switch (method) {
          case 'get' : {
            args = args.concat([options]);
            break;
          }
          default : {
            args = args.concat([json, options]);
            break;
          }
        }
        if (!this.http[method]) {
          console.log('Error: No such HTTP method :', {url, method, json, options});
        }
        return this.http[method].apply(this.http, args).toPromise();
      })
      .then((response) => {
        if (!response) {
          return response;
        }
        if ((response.error || {}).message) {
          throw new Error([
            response.error.code,
            response.error.message
          ].join(': '));
        }
        console.log('HTTP_RESPONSE:', {sub_url, method, options, response});
        return response;
      })
      .catch((error) => {
        console.log('HTTP_ERROR:', {sub_url, method, options, error});
        throw(error);
      });
  }

  getUser() {
    if ( this.account_id ) {
      return null;
    }
    this.check_user = true;
    console.log('UserAccount->getUser');
    return this.storage.get('user').then( (user) => {
      if (user) {
        return user;
      } else {
        return this.storage.get('auth').then( (auth) => {
          if ( !this.auth.email ) {
            this.auth = auth;
          }
          console.log(this.auth);
          return this._request('/account/auth/', 'get', null, null);
        });
      }
    }).then( (user) => {
      if ( !user ) {
        return null;
      }
      if ( !user.account_id ) {
        throw(new Error('FAILED_TO_LOGIN'));
      }

      this.account_id = user.account_id;
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

      console.log( 'Logged in', this.account_id );

      return this.storage.set('user', user).then( () => {
        return user;
      });
    }).finally( () => {
      this.check_user = false;
    });
  }

  createUser() {
    const { account_id, email, username, password, legal_name, language_code, country_code, timezone } = this;
    const params = {account_id, email, username, password, legal_name, language_code, country_code, timezone};
    return this._request('/account', 'post', params, null)
        .then( () => {
          return this.getUser();
        });
  }

  async logIn() {
    console.log('logIn', this.auth);
    await this.storage.set('auth', this.auth);
    const user = await this.getUser();
    await this.listDrafts();
    await this.listTemplates();
    await this.loadProposals();
    console.log('Logged In:', user);
    return user;
  }

  async logOut() {
    await this.storage.remove('auth');
    await this.storage.remove('user');
    await this.storage.remove( [ this.account_id, 'deal' ].join(':') );
    return null;
  }

  getContracts() {
    return this._request('/contract/list/', 'get', null, null)
        .then(data => {
          this.contracts = data;
          return data;
        });
  }

  getActiveDeals() {
    return this._request('/deal/active-deals/', 'get', null, null)
        .then(data => {
          this.contracts = data;
          return data.map( (x) => {
            x.contracter_id = x.parties.filter( (y) => {
              return y.account_id !== x.account_id;
            })[0].account_id;
            return x;
          });
        });
  }

  addContract(memo, body, to_account_id) {
    console.log('addContract', arguments);
    const { account_id } = this;
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

  // *** DRAFTS LOGIC *** //

  async listDrafts() {
    this.drafts = await this._request('/contract/list?type=draft', 'get', null, null);
    return this.drafts;
  }

  saveNewDraft(draft) {
    return this._request('/contract/', 'post', draft, null).then( (contract_id) => {
      const ret = Object.assign(draft, { contract_id : contract_id });
      return this.listDrafts().then( () => {
        return ret;
      });
    });
  }

  saveDraft(draft) {
    return this._request('/contract/' + this.account_id, 'put', draft, null).then( () => {
      return this.listDrafts();
    });
  }

  async getSendTo(keys) {
    return await this._request('/account/search?q=' + keys, 'get', null, null);
  }

  async sendProposal(sendToAccount, currentDraft) {
    console.log('sendProposal', {currentDraft, sendToAccount});
    return await this._request(
        //`/deal?contract_id=${currentDraft.contract_id}&to_account_id=${sendToAccount.account_id}&deal_title=${currentDraft.memo}&email=${sendToAccount.email}`,
        '/deal?' + this.buidQueryString({
          contract_id: currentDraft.contract_id,
          to_account_id: sendToAccount.account_id,
          deal_title: currentDraft.memo,
          email: sendToAccount.email
        }),
        'post', null, null);
  }

  // *** TEMPLATES LOGIC *** //

  addTemplate(title, body) {
    console.log('addTemplate', arguments);
    const { account_id } = this;
    const template_body = { account_id, title, body };
    return this._request('/template/', 'post', template_body, null)
        .then(data => {
	  console.log('addTemplate-data', data);
	  const { template_id } = data;
	  const dialog = [
	    { account_id, template_id }
	  ];
	});
  }
  
  async listTemplates() {
    this.templates = await this._request('/template/list', 'get', null, null);
    return this.templates;
  }

  saveNewTemplate(template) {
    return this._request('/template/', 'post', template, null).then( () => {
      return this.listTemplates();
    });
  }

  saveTemplate(template) {
    return this._request('/template/' + this.account_id, 'put', template, null).then( () => {
      return this.listTemplates();
    });
  }

  // *** PROPOSALS LOGIC *** //

  async loadProposals() {
    // /deal/received-proposals -> proposals
    this.proposals = await this._request('/deal/received-proposals', 'get', null, null);
    this.proposals = this.proposals.map( (x) => {
          x.contracter_id = x.parties.filter( (y) => {
            return y.account_id !== this.account_id;
          })[0].account_id;
          return x;
        });
    console.log('loadProposals', this.proposals);
  }

  // *** DEAL LOGIC *** //

  async setDealToView(deal) {
    console.log('setDealToView', deal);
    await this.getUser();
    this.dealToView = deal;
    await this.storage.set( [ this.account_id, 'deal' ].join(':'), deal );
  }

  async getDealToView() {
    await this.init();
    await this.getUser();
    this.dealToView = await this.storage.get( [ this.account_id, 'deal' ].join(':') );
    const secondParty = (this.dealToView.parties || []).filter( (x) => {
      return x.account_id !== this.account_id;
    })[0];
    if ( secondParty.account_id ) {
      this.dealToView.secondParty = await this._request('/account/' + secondParty.account_id, 'get', null, null);
    }
  }

  async removeDealToView() {
    await this.getUser();
    await this.storage.remove( [ this.account_id, 'deal' ].join(':') );
    this.dealToView = {};
  }

  async dealAccept(deal) {
    return await this._request('/deal/accept/' + deal.contract_id, 'put', null, null);
  }

  buidQueryString(obj) {
    return Object.keys(obj).map( (key) => {
      return [key, encodeURIComponent(obj[key])].join('=');
    }).join('&');
  }

  async sendCounter(deal, counterContract) {
    await this._request('/contract/' + counterContract.contract_id, 'put', counterContract, null);
    let queryObj = { contract_id : counterContract.contract_id };
    console.log('tmp', queryObj);
    let r = await this._request('/deal/' + deal.deal_id, 'post', queryObj, null);
    console.log('sendCounter', deal, counterContract, '->', r);
    return r;
  }

  async openCounter(deal) {
    let contract_id = await this._request('/contract/' + deal.contract_id, 'post', null, null);
    let counterContract = await this._request('/contract/' + contract_id, 'get', null, null);
    console.log('openCounter', deal, '->', {counterContract});
    return counterContract;
  }

  getDealSecondPartyName(deal) {
    return (deal.secondParty || {}).legal_name || (deal.secondParty || {}).username || (deal.secondParty || {}).email;
  }
}
