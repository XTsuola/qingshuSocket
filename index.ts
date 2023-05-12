// deno-lint-ignore-file
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

const wss = new WebSocketServer(7001);
const idList: number[] = [];
const objList: any = [];
const baseUrl = "http://110.40.151.228:7145/"
wss.on("connection", function (ws: WebSocketClient) {
  ws.on("message", async function (message: string) {
    if (message != "undefined") {
      const params = JSON.parse(message);
      if (params.connect == true) {
        const ind = idList.findIndex((item: number) => item == params.id);
        if (ind == -1) {
          idList.push(params.id);
          objList.push(ws);
        } else {
          objList.splice(ind, 1, ws);
        }
        const res2 = await axiod.get(
          baseUrl + "qingshu/getGameData",
        );
        for (let i = 0; i < idList.length; i++) {
          objList[i].send(JSON.stringify(res2.data));
        }
      } else {
        if (params.order == "goChair") { // 选择椅子指令
          const res = await axiod.get(
            baseUrl + "qingshu/selectChair?id=" + params.id +
              "&num=" + params.num,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              baseUrl + "qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "goTree") { // 进入等待区指令
          const res = await axiod.get(
            baseUrl + "qingshu/goTree?id=" + params.id,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              baseUrl + "qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "goRoom") { // 进入房间指令
          const res = await axiod.get(
            baseUrl + "qingshu/goRoom",
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              baseUrl + "qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "zhunbei") { // 准备指令
          const res = await axiod.get(
            baseUrl + "qingshu/zhunbei?id=" + params.id,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              baseUrl + "qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "mopai") { // 摸牌指令
          const res = await axiod.get(
            baseUrl + "qingshu/mopai?id=" + params.id,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              baseUrl + "qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "reset") { // 重置指令
          const res = await axiod.get(
            baseUrl + "qingshu/getGameData",
          );
          for (let i = 0; i < idList.length; i++) {
            objList[i].send(JSON.stringify(res.data));
          }
        } else if (params.order == "chupai") { // 出牌指令
          const res = await axiod.get(
            baseUrl + "qingshu/chupai?id=" + params.id + "&wz=" +
              params.wz + "&tid=" + params.tid + "&tpai=" + params.tpai +
              "&ypai=" + params.ypai,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              baseUrl + "qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              if(params.ypai == 1) {
                res2.data.order = 1
                res2.data.id = params.id
                res2.data.tid = params.tid
                res2.data.tpai = params.tpai
              } else if(params.ypai == 2) {
                res2.data.order = 2
                res2.data.id = params.id
                res2.data.tid = params.tid
              } else if(params.ypai == 3) {
                res2.data.order = 3
                res2.data.id = params.id
                res2.data.tid = params.tid
              } else if(params.ypai == 5) {
                res2.data.order = 5
                res2.data.id = params.id
                res2.data.tid = params.tid
              } else if(params.ypai == 6) {
                res2.data.order = 6
                res2.data.id = params.id
                res2.data.tid = params.tid
              }
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        }
      }
    }
  });
});
