interface Map {
    [key: string]: any
}
export const Networks: Map = {
    "0x38" :{
        chainId: "0x38",
        chainName: "BNB Smart Chain",
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
        },
        blockExplorerUrls: ["https://bscscan.com"],
    },
    "0x61" :{
        chainId: "0x61",
        chainName: "BNB Smart Chain - Testnet",
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
        },
        blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
}