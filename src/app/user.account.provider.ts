import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { Injectable } from '@angular/core';

@Injectable()
export class UserAccount {
  private backend_host = 'http://172.104.123.14:28081';
  // private backend_host = 'http://46.219.125.69:5000';

  public auth;
  public user;

  public drafts;
  public templates;
  public proposals;
  public contracts;
  public dealToView;

  constructor(private http: HttpClient, private storage: Storage) {
    console.log('UserAccount->constructor');
    this.auth = {};
    this.user = {
      country_code : 'US',
      language_code : 'eng',
      timezone : 'America/Los_Angeles'
    };
    this.drafts = [];
    this.templates = [];
    this.proposals = [];
    this.contracts = [];
    this.dealToView = {};
  }

  async init() {
    return await this.restore();
  }

  public newTemplatesCount(): number {
    return this.templates ? this.templates.length : 0;
  }

  public newDraftsCount(): number {
    return this.drafts ? this.drafts.length : 0;
  }

  public newProposalsCount(): number {
    return this.proposals ? this.proposals.length : 0;
  }

  public newActiveDealsCount(): number {
    return this.contracts ? this.contracts.length : 0;
  }

  public _request(sub_url, method, json, options) {
    // if create account - skip validation
    if ( !( '/account' === sub_url && /post/i.test(method) ) ) {
      if ( !(this.auth || {}).email ) {
        console.log('Error - email is not set', this.auth);
        return null;
      }

      if ( !(this.auth || {}).password ) {
        console.log('Error - password is not set', this.auth);
        return null;
      }
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
    return this.http[method].apply(this.http, args).toPromise().then( (response) => {
      console.log('HTTP_RESPONSE:', {sub_url, method, options, response});
      return response;
    });
  }

  async store() {
    const {auth, user, dealToView, contracts, proposals, templates, drafts} = this;
    const userData = {auth, user, dealToView, contracts, proposals, templates, drafts};
    console.log('STORED', userData);
    return await this.storage.set('user', userData);
  }

  async restore() {
    const userData = await this.storage.get('user') || {};
    console.log('RESTORED', userData);
    Object.keys(userData).forEach( (key) => {
      this[key] = userData[key];
    });
  }

  async clear() {
    return await this.storage.remove('user');
  }

  async getUser() {
    if ( this.user ) {
      if ( this.user.account_id ) {
        return this.user;
      }
    }
    this.user = await this._request('/account/auth/', 'get', null, null);
    console.log('getUser', this.user, this.auth);
    await this.store();
  }

  async createUser() {
    await this._request('/account', 'post', this.user, null);
    this.auth = {
      email : this.user.email,
      password : this.user.password
    };
    this.user = null;
    await this.getUser();
    await this.store();
  }

  async logIn() {
    return await this.getUser();
  }

  async logOut() {
    await this.storage.remove('user');
  }

  async getContracts() {
    this.contracts = await this._request('/contract/list/', 'get', null, null);
    await this.store();
  }

  async getActiveDeals() {
    const data = await this._request('/deal/active-deals/', 'get', null, null);

    this.contracts = data.map( (x) => {
      x.contracter_id = x.parties.filter( (y) => {
        return y.account_id !== x.account_id;
      })[0].account_id;
      return x;
    });

    await this.store();
  }

  async addContract(memo, body, to_account_id) {
    const { account_id } = this.user;
    const contract_body = { account_id, memo, body };
    const data = await this._request('/contract/', 'post', contract_body, null);

    const { contract_id } = data;
    const dialog = [
      { account_id, contract_id }
    ];
    const parties = [
      { account_id, contract_id },
      { account_id : to_account_id, contract_id },
    ];
    const deal_body = { account_id, title : memo, dialog, parties };
    const deal_id = await this._request('/deal/', 'post', deal_body, null);
  }

  // *** DRAFTS LOGIC *** //

  async listDrafts() {
    this.drafts = await this._request('/contract/list?type=draft', 'get', null, null);
    await this.store();
  }

  async saveNewDraft(draft) {
    const contract_id = await this._request('/contract/', 'post', draft, null);
    const ret = Object.assign(draft, { contract_id });
    await this.listDrafts();
    return ret;
  }

  async saveDraft(draft) {
    const ret = await this._request('/contract/' + this.user.account_id, 'put', draft, null);
    await this.listDrafts();
    return ret;
  }

  async getSendTo(keys) {
    return await this._request('/account/search?q=' + keys, 'get', null, null);
  }

  async sendProposal(sendToAccount, currentDraft) {
    const queryString = this.buidQueryString({
      contract_id: currentDraft.contract_id,
      to_account_id: sendToAccount.account_id,
      deal_title: currentDraft.memo,
      email: sendToAccount.email
    });
    return await this._request( '/deal?' + queryString, 'post', null, null);
  }

  // *** TEMPLATES LOGIC *** //

  async addTemplate(title, body) {
    const { account_id } = this.user;
    const template_body = { account_id, title, body };
    const data = await this._request('/template/', 'post', template_body, null);
    console.log('addTemplate-data', data);
  }

  async listTemplates() {
    this.templates = await this._request('/template/list', 'get', null, null);
    this.store();
  }

  async saveNewTemplate(template) {
    await this._request('/template/', 'post', template, null);
    await this.listTemplates();
  }

  async saveTemplate(template) {
    await this._request('/template/' + this.user.account_id, 'put', template, null);
    await this.listTemplates();
  }

  // *** PROPOSALS LOGIC *** //

  async loadProposals() {
    // /deal/received-proposals -> proposals
    this.proposals = await this._request('/deal/received-proposals', 'get', null, null);
    this.proposals = this.proposals.map( (x) => {
          x.contracter_id = x.parties.filter( (y) => {
            return y.account_id !== this.user.account_id;
          })[0].account_id;
          return x;
        });
    console.log('loadProposals', this.proposals);
  }

  // *** DEAL LOGIC *** //

  async setDealToView(deal) {
    console.log('setDealToView', deal);
    this.dealToView = deal;
    await this.store();
  }

  async getDealToView() {
    // it is already in this.dealToView
    const secondParty = (this.dealToView.parties || []).filter( (x) => {
      return x.account_id !== this.user.account_id;
    })[0];
    if ( secondParty.account_id ) {
      this.dealToView.secondParty = await this._request('/account/' + secondParty.account_id, 'get', null, null);
    }
    await this.store();
  }

  async removeDealToView() {
    this.dealToView = {};
    await this.store();
  }

  async dealAccept(deal) {
    await this._request('/deal/accept/' + deal.contract_id, 'put', null, null);
  }

  buidQueryString(obj) {
    return Object.keys(obj).map( (key) => {
      return [key, encodeURIComponent(obj[key])].join('=');
    }).join('&');
  }

  async sendCounter(deal, counterContract) {
    await this._request('/contract/' + counterContract.contract_id, 'put', counterContract, null);
    const queryObj = { contract_id : counterContract.contract_id };
    console.log('tmp', queryObj);
    const ret = await this._request('/deal/' + deal.deal_id, 'post', queryObj, null);
    console.log('sendCounter', deal, counterContract, '->', ret);
    return ret;
  }

  async openCounter(deal) {
    const contract_id = await this._request('/contract/' + deal.contract_id, 'post', null, null);
    const  counterContract = await this._request('/contract/' + contract_id, 'get', null, null);
    console.log('openCounter', deal, '->', {counterContract});
    return counterContract;
  }

  getDealSecondPartyName(deal) {
    return (deal.secondParty || {}).legal_name || (deal.secondParty || {}).username || (deal.secondParty || {}).email;
  }
}
