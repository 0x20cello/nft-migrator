import { AfterViewInit, Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";
import { BscscanProvider } from "@ethers-ancillary/bsc";
import { Moralis } from 'moralis';
import Freezeframe from 'freezeframe';
import { FreezeframeOptions } from 'freezeframe/dist/packages/freezeframe/types';
import { trigger, transition, style, animate } from '@angular/animations';

const fadeOut = trigger('fadeOut', [
  transition(':leave', [
    style({
      opacity: 1
    }),
    animate('1s ease-out', style({
      opacity: 0
    }))
  ])
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ fadeOut ]
})
export class AppComponent implements OnInit {
  selectedAddress: string;
  metamaskError: boolean;
  provider!: ethers.providers.Web3Provider;
  eth:any;
  currentUser!: any;
  nftList: any = {};
  bgAudio !: HTMLAudioElement;
  audioCtrl!: Freezeframe;
  showOverlay: Boolean = true;

  constructor() {
    
    this.selectedAddress = '';
    this.metamaskError = false;
    this.eth = window.ethereum as any;

    const serverUrl = "https://6oau4ytmivvd.usemoralis.com:2053/server";
    const appId = "SJUZUWZak9395fqctw7RUoeQAgE56DwcHTJBWBRd";
    Moralis.start({ serverUrl, appId });
  }
  
  async connectToWallet() {
    this.currentUser = await Moralis.authenticate({ signingMessage: "NFTMigrate Login." });
    setTimeout(()=> {
      this.setSelectedAddress(this.currentUser.get("ethAddress"));
      this.getNfts();
    }, 1);
  }

  async setSelectedAddress(address:string) {
    this.selectedAddress = address
    await this.getNfts();
  }

  async checkWalletConnection() {
    this.currentUser = Moralis.User.current();
    if(this.currentUser) this.setSelectedAddress(this.currentUser.get("ethAddress"));
  }

  async getNfts() {
    this.nftList = await Moralis.Web3API.account.getNFTs({
      chain: 'bsc',
      address: this.selectedAddress
    });

  }

  async ngOnInit(): Promise<void> {
    
    window.document.body.style.backgroundImage = "url(https://i.redd.it/u4wfyrj4tho21.png)";
    this.bgAudio = new Audio();
    this.bgAudio.src = "../../../assets/brazilll.mp3";
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.3;
    this.bgAudio.load();
    let initAudio = true;
    
    if(this.eth) {
      
      this.eth.on('accountsChanged', (accounts: string[]) => {
        Moralis.User.logOut();
        window.location.reload();
      });

      this.checkWalletConnection();
    } else {
      this.metamaskError = true;
    }
  }

  start () {
    this.showOverlay = false;
    this.bgAudio.play();
  }
  
  audioCtrlClick() {
    if(this.bgAudio.paused) this.bgAudio.play();
    else this.bgAudio.pause();
    if(!this.audioCtrl) {
      this.audioCtrl = new Freezeframe('#audioCtrl', {
        trigger: false,
        overlay: false
      });
    }

    this.audioCtrl.toggle();
  }
}
