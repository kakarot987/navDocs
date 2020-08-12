import { Component, OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/services/upload-file.service';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import {UserService} from '../_services/user.service'
import { TokenStorageService } from '../_services/token-storage.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from "file-saver/dist/FileSaver";

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content: any ;
  username : String
  cookUsername : String;
  arr: any;


  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  currentUser: any;
  now:number;


  fileInfos: any;
  constructor(private uploadService: UploadFileService, private authService:AuthService, private userService: UserService, private token: TokenStorageService, private http:HttpClient) {
    setInterval(() => {
      this.now = Date.now();
    }, 1);
   }

  ngOnInit() {
    this.fileInfos = this.uploadService.getFiles();
    this.currentUser = this.token.getUser();

    this.userService.getUserBoard().subscribe(
      data => {
        this.content = data
      }
    ) 

    this.authService.getCookie().subscribe(res=>{
      console.log(res)
      this.arr = res;
    })
  }

  cookiePost(fileName: String, url){
    this.currentUser = this.token.getUser();
    this.cookUsername = this.currentUser.username;
    const body = {
      "username" : this.cookUsername,
      "time" : this.now.toString(),
      "docName" :  fileName
    };
    this.authService.addCookie(body).subscribe((response :any)=>{
      if (response.statusCode == 200){
        console.log("ok");
      }
      else if(response.statusCode==400){
        alert(response.status);
      }
    });

this.http.get(url, {responseType: 'arraybuffer'}).subscribe(pdf =>{
  const blob = new Blob([pdf], {type: 'application/pdf'});
  const fileNam = fileName;
  saveAs(blob, fileNam);
}, err =>{
  console.log(err);
});

  }

}
