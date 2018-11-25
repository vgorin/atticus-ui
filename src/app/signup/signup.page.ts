import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.page.html',
  styleUrls: ['signup.page.scss'],
})
export class SignupPage implements OnInit {
  public step: number = 1;

  public email: string;
  public password: string;
  public verifyPassword: string;

  public name: string;
  public username: string;

    public id: string;

    constructor(
        private http: HttpClient
    ) { }

    getUser() {
        const url = 'http://192.168.1.236:8080/account/user/despotix';
        const options =  {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this.http.get(url, options).subscribe(data => {
            console.log('my data: ', data);
        });
    }

    createUser() {
        console.log(1, this, arguments);

        const url = 'http://192.168.1.236:8080/account/user/despotix';
        const options =  {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const json = {
            account_id : 1,
            email : 'despotix3@gmail.com',
            username : 'Despotix3',
            password : 'test1',
            legal_name : 'Legal',
            language_code : 'eng',
            country_code : 'US',
            timezone : 'America/Los_Angeles'
        };
        this.http.post(url, json, options).subscribe(data => {
            console.log('my data: ', data);
        });

        const self = this;
        setTimeout( ( () => {
            console.log(this.id, self.id);
        }), 5555);
    }
}
