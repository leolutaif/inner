import React, { useState } from 'react';
import DosPlayer from '../dos/DosPlayer';
import Window from '../os/Window';

export interface BTCAppProps extends WindowAppProps {}

const BTCsrc: React.FC<BTCAppProps> = (props) => {
    const [width, setWidth] = useState(700);
    const [height, setHeight] = useState(550);
    const [showPopup, setShowPup] = useState(0)
    const code = `
#include <cassert>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <map>
#include <vector>
#include <string>
#include <set>
#include <unordered_map>
#include <thread>
#include <mutex>
#include <memory>
#include <algorithm>
#include <functional>
#include <chrono>
#include <random>
#include <utility>
#include <fstream>
#include <sstream>
#include <iterator>
#include <array>
#include <deque>
#include <optional>
#include <atomic>
#include <condition_variable>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

struct uint256 {
    std::array<uint8_t,32> data;
    bool operator==(const uint256 &o) const {
        return data == o.data;
    }
};
struct uint160 {
    std::array<uint8_t,20> data;
    bool operator==(const uint160 &o) const {
        return data == o.data;
    }
};

struct HashUint256 {
    std::size_t operator()(const uint256 &h) const {
        std::size_t r = 0;
        for (auto c : h.data) {
            r = (r * 131) + c;
        }
        return r;
    }
};

struct HashUint160 {
    std::size_t operator()(const uint160 &h) const {
        std::size_t r = 0;
        for (auto c : h.data) {
            r = (r * 131) + c;
        }
        return r;
    }
};

struct COutPoint {
    uint256 hash;
    uint32_t n;
    bool operator==(const COutPoint &o) const {
        return hash == o.hash && n == o.n;
    }
};
struct HashOutPoint {
    std::size_t operator()(const COutPoint &op) const {
        std::size_t r = 0;
        for (auto c : op.hash.data) {
            r = (r * 131) + c;
        }
        r = (r * 131) + op.n;
        return r;
    }
};

struct CTxIn {
    COutPoint prevout;
    std::vector<uint8_t> scriptSig;
    uint32_t nSequence;
};
struct CTxOut {
    int64_t nValue;
    std::vector<uint8_t> scriptPubKey;
};
struct CTransaction {
    int32_t nVersion;
    std::vector<CTxIn> vin;
    std::vector<CTxOut> vout;
    uint32_t nLockTime;
};

struct CBlockHeader {
    int32_t nVersion;
    uint256 hashPrevBlock;
    uint256 hashMerkleRoot;
    uint32_t nTime;
    uint32_t nBits;
    uint32_t nNonce;
};

struct CBlock {
    CBlockHeader header;
    std::vector<CTransaction> vtx;
};

struct CAddress {
    uint64_t services;
    struct sockaddr_in addr;
    uint64_t nTime;
};

struct NodeInfo {
    int id;
    CAddress address;
    uint64_t nServices;
    std::string strSubVer;
    bool fRelay;
    uint64_t nStartingHeight;
};

struct Coin {
    bool fCoinBase;
    int nHeight;
    int64_t nValue;
    std::vector<uint8_t> scriptPubKey;
};

struct UTXOSet {
    std::unordered_map<COutPoint,Coin,HashOutPoint> mapUTXO;
};

struct CBlockIndex {
    uint256 phashBlock;
    CBlockIndex *pprev;
    int nHeight;
    uint32_t nTime;
    uint32_t nBits;
    uint256 hashMerkleRoot;
};

struct CChain {
    std::vector<CBlockIndex*> vChain;
    CBlockIndex* Tip() const {
        if (vChain.empty()) return nullptr;
        return vChain.back();
    }
    void SetTip(CBlockIndex *pindex) {
        vChain.push_back(pindex);
    }
};

struct CNodeState {
    int peerId;
    bool fSyncStarted;
    int nMisbehavior;
    bool fShouldBan;
};

struct GlobalState {
    UTXOSet utxos;
    std::unordered_map<uint256, CBlockIndex*, HashUint256> mapBlockIndex;
    CChain chainActive;
    std::unordered_map<int, NodeInfo> mapNodes;
    std::unordered_map<int, CNodeState> mapNodeState;
    std::unordered_map<uint256, CBlock, HashUint256> mapBlocks;
    std::mutex cs_main;
};

GlobalState g_state;

bool CheckBlock(const CBlock &block) {
    return !block.vtx.empty();
}

bool ConnectBlock(const CBlock &block, CBlockIndex *pindex) {
    for (size_t i = 0; i < block.vtx.size(); i++) {
        const CTransaction &tx = block.vtx[i];
        for (auto &in : tx.vin) {
            if (g_state.utxos.mapUTXO.find(in.prevout) == g_state.utxos.mapUTXO.end()) {
                return false;
            }
        }
        for (size_t j = 0; j < tx.vout.size(); j++) {
            COutPoint outp;
            outp.hash = pindex->phashBlock;
            outp.n = (uint32_t)j;
            Coin coin;
            coin.fCoinBase = (i == 0);
            coin.nValue = tx.vout[j].nValue;
            coin.scriptPubKey = tx.vout[j].scriptPubKey;
            coin.nHeight = pindex->nHeight;
            g_state.utxos.mapUTXO.insert({outp, coin});
        }
        for (auto &in : tx.vin) {
            g_state.utxos.mapUTXO.erase(in.prevout);
        }
    }
    return true;
}

bool ActivateBestChain(CBlock &block) {
    uint256 hash = block.header.hashMerkleRoot;
    if (!CheckBlock(block)) return false;
    CBlockIndex *pindexNew = new CBlockIndex();
    pindexNew->phashBlock = hash;
    pindexNew->pprev = g_state.chainActive.Tip();
    pindexNew->nHeight = pindexNew->pprev ? pindexNew->pprev->nHeight+1 : 0;
    pindexNew->nTime = block.header.nTime;
    pindexNew->hashMerkleRoot = block.header.hashMerkleRoot;
    if (!ConnectBlock(block, pindexNew)) {
        delete pindexNew;
        return false;
    }
    g_state.mapBlockIndex[hash] = pindexNew;
    g_state.chainActive.SetTip(pindexNew);
    g_state.mapBlocks[hash] = block;
    return true;
}

void ProcessMessages(int peer) {
    if (g_state.mapNodes.find(peer) == g_state.mapNodes.end()) return;
    NodeInfo &info = g_state.mapNodes[peer];
    (void)info;
}

void RelayTransaction(const CTransaction &tx) {
    (void)tx;
}

void RelayBlock(const CBlock &block) {
    (void)block;
}

void RunNode() {
    {
        std::lock_guard<std::mutex> lock(g_state.cs_main);
        uint256 zerohash;
        memset(zerohash.data.data(),0,zerohash.data.size());
        CBlock genesis;
        genesis.header.nTime = 1231006505;
        genesis.header.nBits = 0x1d00ffff;
        genesis.header.nNonce = 2083236893;
        genesis.header.hashMerkleRoot = zerohash;
        CTransaction coinbase;
        coinbase.nVersion = 1;
        coinbase.nLockTime = 0;
        CTxOut out;
        out.nValue = 50 * 100000000;
        coinbase.vout.push_back(out);
        genesis.vtx.push_back(coinbase);
        ActivateBestChain(genesis);
    }
    for (;;) {
        std::this_thread::sleep_for(std::chrono::seconds(1));
        {
            std::lock_guard<std::mutex> lock(g_state.cs_main);
            for (auto &it : g_state.mapNodes) {
                ProcessMessages(it.first);
            }
        }
    }
}

int main() {
    RunNode();
    return 0;
}`;

    return (
        <Window
            top={10}
            left={10}
            width={width}
            height={height}
            windowTitle="Bitcoin source code"
            windowBarColor="#000000"
            windowBarIcon="windowGameIcon"
            bottomLeftText={'Powered by Satoshi Nakamoto'}
            closeWindow={props.onClose}
            onInteract={props.onInteract}
            minimizeWindow={props.onMinimize}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
        >
            <div
                className="container-code"
                style={{
                    display: 'block',
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                    background: 'black',
                }}
            >
                <pre
                    style={{
                        color: 'green',
                        backgroundColor: 'black',
                        padding: '10px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',

                        overflow: 'auto',
                        fontSize: '14px',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {code}
                </pre>
                <div className="button-content" style={styles.buttonContent}>
                    <button style={styles.button} onClick={() => setShowPup(1)}>Run</button>
                </div>
            </div>
            <div className="container-btc" style={{opacity: showPopup}}>
                <Window
                    top={10}
                    left={10}
                    width={350}
                    height={150}
                    windowTitle="Success!"
                    windowBarColor="#000000"
                    windowBarIcon="windowGameIcon"
                    bottomLeftText={''}
                    closeWindow={props.onClose}
                    onInteract={props.onInteract}
                    minimizeWindow={props.onMinimize}
                    onWidthChange={setWidth}
                    onHeightChange={setHeight}
                >
                    <div
                        style={{
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                        className="p-container"
                    >
                        <p>Bitcoin is running...</p>
                    </div>
                </Window>
            </div>
        </Window>
    );
};

const styles: StyleSheetCSS = {
    button: {
        padding: '0px 72px',
        background: 'transparent',
        zIndex: 2,
        color: 'black',
        position: 'fixed',
        fontSize: '12px',
    },
    buttonContent: {
        position: 'absolute',
        bottom: '-10px',
        right: '179px',
    },
};

export default BTCsrc;
