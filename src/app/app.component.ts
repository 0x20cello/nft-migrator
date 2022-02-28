import { AfterViewInit, Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";
import { BscscanProvider } from "@ethers-ancillary/bsc";
import { Moralis } from 'moralis';
import Freezeframe from 'freezeframe';
import { FreezeframeOptions } from 'freezeframe/dist/packages/freezeframe/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
      this.selectedAddress = this.currentUser.get("ethAddress");
    }, 1);
  }

  async checkWalletConnection() {
    this.currentUser = Moralis.User.current();
    if(this.currentUser) this.selectedAddress = this.currentUser.get("ethAddress");
  }

  async getNfts() {
    this.nftList = await Moralis.Web3API.account.getNFTs({
      chain: 'bsc',
      address: this.selectedAddress
    });

  }

  async ngOnInit(): Promise<void> {
    
    this.bgAudio = new Audio();
    this.bgAudio.src = "../../../assets/brazilll.mp3";
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.3;
    this.bgAudio.load();
    this.bgAudio.play();

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
