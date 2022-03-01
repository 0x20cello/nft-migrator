import { AfterViewInit, Component, OnInit } from '@angular/core';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from "ethers";
import { BscscanProvider } from "@ethers-ancillary/bsc";
import { Moralis } from 'moralis';
import Freezeframe from 'freezeframe';
import { FreezeframeOptions } from 'freezeframe/dist/packages/freezeframe/types';
import { trigger, transition, style, animate } from '@angular/animations';
import { Web3ModalService } from '@mindsorg/web3modal-angular';
import { Networks } from './networks';

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
  bgAudio !: HTMLAudioElement;
  audioCtrl!: Freezeframe;
  showOverlay: Boolean = true;
  net !: any;

  nftList: any = {};
  selectedNfts: any[] = [];

  constructor(private web3modalService: Web3ModalService) {
    
    this.selectedAddress = '';
    this.metamaskError = false;
    this.eth = window.ethereum as any;

    const serverUrl = "https://6oau4ytmivvd.usemoralis.com:2053/server";
    const appId = "SJUZUWZak9395fqctw7RUoeQAgE56DwcHTJBWBRd";
    Moralis.start({ serverUrl, appId });
  }
  
  async connectMetamask() {
    this.currentUser = await Moralis.authenticate({ signingMessage: "NFTMigrate Login." });
    setTimeout(()=> {
      this.setSelectedAddress(this.currentUser.get("ethAddress"));
      this.getNfts();
    }, 1);
  }

  async walletConnect() {
    this.currentUser = await Moralis.authenticate({ signingMessage: "NFTMigrate Login.", provider: "walletconnect" });
    setTimeout(()=> {
      this.setSelectedAddress(this.currentUser.get("ethAddress"));
      this.getNfts();
    }, 1);
  }

  // isSelected(nft) {
  //   return 
  // }

  async checkWalletConnection() {
    this.currentUser = Moralis.User.current();
    if(this.currentUser) this.setSelectedAddress(this.currentUser.get("ethAddress"));
  }

  async setSelectedAddress(address:string) {
    this.selectedAddress = address
    await this.getNfts();
  }

  async getNfts() {
    this.nftList = await Moralis.Web3API.account.getNFTs({
      chain: this.net.chainId,
      address: this.selectedAddress
    });
    console.log(this.nftList)
  }

  async switchNetwork(chainId: string) {
    try {
      await this.eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
      this.net = Networks[chainId];
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await this.eth.request({
            method: "wallet_addEthereumChain",
            params: [
              Networks[chainId]
            ],
          });
          this.net = Networks[chainId];
        } catch (error: any) {
          console.log(error);
        }
      }
    }
    

  }

  async ngOnInit(): Promise<void> {
    window.document.body.style.backgroundImage = "url(https://i.redd.it/u4wfyrj4tho21.png)";
    this.bgAudio = new Audio();
    this.bgAudio.src = "../../../assets/brazilll.mp3";
    this.bgAudio.loop = true;
    this.bgAudio.volume = 0.3;
    this.bgAudio.load();
    
    if(this.eth) {
      
      function reload() {
        Moralis.User.logOut();
        window.location.reload();
      }

      this.eth.on('accountsChanged', reload);
      this.eth.on('chainChanged', reload);
    } else {
      this.metamaskError = true;
    }
  }

  networkList() {
    return Object.values(Networks);
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
