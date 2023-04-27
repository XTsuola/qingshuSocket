// deno-lint-ignore-file
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";

const wss = new WebSocketServer(7001);
const idList: number[] = [];
const objList: any = [];
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
          "http://127.0.0.1:7145/qingshu/getGameData",
        );
        for (let i = 0; i < idList.length; i++) {
          objList[i].send(JSON.stringify(res2.data));
        }
      } else {
        if (params.order == "zhunbei") {
          const res = await axiod.get(
            "http://127.0.0.1:7145/qingshu/zhunbei?id=" + params.id,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              "http://127.0.0.1:7145/qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "mopai") { // 摸牌指令
          const res = await axiod.get(
            "http://127.0.0.1:7145/qingshu/mopai?id=" + params.id,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              "http://127.0.0.1:7145/qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        } else if (params.order == "reset") { // 重置指令
          const res = await axiod.get(
            "http://127.0.0.1:7145/qingshu/getGameData",
          );
          for (let i = 0; i < idList.length; i++) {
            objList[i].send(JSON.stringify(res.data));
          }
        } else if (params.order == "chupai") { // 出牌指令
          const res = await axiod.get(
            "http://127.0.0.1:7145/qingshu/chupai?id=" + params.id + "&wz=" +
              params.wz + "&tid=" + params.tid + "&tpai=" + params.tpai +
              "&ypai=" + params.ypai,
          );
          if (res.data.code == 200) {
            const res2 = await axiod.get(
              "http://127.0.0.1:7145/qingshu/getGameData",
            );
            for (let i = 0; i < idList.length; i++) {
              objList[i].send(JSON.stringify(res2.data));
            }
          }
        }
      }
    }
  });
});
