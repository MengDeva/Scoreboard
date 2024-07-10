import asyncio
import websockets
import json
import tkinter as tk
from tkinter import ttk
from tkinter import *
from tkinter.ttk import *
import threading
import socket
import time

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(('10.255.255.255', 1))
IPAddr = s.getsockname()[0]
s.close()

d_time = 0

score_data = {
    'plant1': 0,
    'harvest1': 0,
    'store1': 0,
    'plant2': 0,
    'harvest2': 0,
    'store2': 0,
    'silos': [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
    'team1': "NPIC",
    'team2': "NPIC"
}

def updateFile(data, file_path):
  with open(file_path, 'w') as f:
    f.write(data)

def appending_silo(silo: list, ball: int):
    for i in range(3):
        if silo[i] == 0:
            silo[i] = ball
            break
        else: 
            continue

    return silo

controller_connections = 0
display_connected = False

def update_connections():
    controller_label.config(text=f"Controller Connections: {controller_connections}")
    if display_connected:
        display_label.config(text="Display Connected: Yes", foreground="green")
    else:
        display_label.config(text="Display Connected: No", foreground="red")
    root.after(100, update_connections)

async def handle_controller(websocket, path):
    global controller_connections
    controller_connections += 1
    update_connections()

    try:
        async for message in websocket:
            data = json.loads(message)
            print(f"Controller received: {data}")
            team = data["team"]
            area = data["area"]
            more = data["index"]

            if team == 1:
                if area == 1:
                    if more == 0:
                        if score_data['plant1'] > 0:
                            score_data['plant1'] -= 1
                    elif more == 1:
                        if score_data['plant1'] < 12:
                            score_data['plant1'] += 1
                elif area == 2:
                    if more == 0:
                        if score_data['harvest1'] > 0:
                            score_data['harvest1'] -= 1
                    elif more == 1:
                        if score_data['harvest1'] < 12:
                            score_data['harvest1'] += 1
                elif area == 3:
                    if 0 in score_data['silos'][more]:
                        score_data['store1'] += 1
                        score_data['silos'][more] = appending_silo(score_data['silos'][more], 1)

            elif team == 2:
                if area == 1:
                    if more == 0:
                        if score_data['plant2'] > 0:
                            score_data['plant2'] -= 1
                    elif more == 1:
                        if score_data['plant2'] < 12:
                            score_data['plant2'] += 1
                elif area == 2:
                    if more == 0:
                        if score_data['harvest2'] > 0:
                            score_data['harvest2'] -= 1
                    elif more == 1:
                        if score_data['harvest2'] < 12:
                            score_data['harvest2'] += 1
                elif area == 3:
                    if 0 in score_data['silos'][more]:
                        score_data['store2'] += 1
                        score_data['silos'][more] = appending_silo(score_data['silos'][more], 2)

            updateFile(f"{score_data['plant1']*10+score_data['harvest1']*10+score_data['store1']*30}", "VData/score1.txt")
            updateFile(f"{score_data['plant2']*10+score_data['harvest2']*10+score_data['store2']*30}", "VData/score2.txt")

            score_data_json = json.dumps(score_data)
            await broadcast_to_displays(score_data_json)

    finally:
        controller_connections -= 1
        update_connections()

async def handle_display(websocket, path):
    global display_connected, display_ws
    display_connected = True
    display_ws = websocket
    update_connections()

    try:
        async for message in websocket:
            print(f"Display received: {message}")
    finally:
        display_connected = False
        update_connections()

async def broadcast_to_displays(message):
    global display_connected
    if display_connected:
        try:
            await display_ws.send(message)
        except websockets.exceptions.ConnectionClosed:
            display_connected = False
            update_connections()

async def start_controller():
    async with websockets.serve(handle_controller, IPAddr, 8834):
        print("Controller listening on port 8834")
        await asyncio.Future()

async def start_display():
    global display_ws
    async with websockets.serve(handle_display, "localhost", 8991):
        print("Display server listening on port 8991")
        await asyncio.Future()

def reset(t1:ttk.Entry, t2:ttk.Entry):
    global score_data
    team1:str = t1.get()
    team2:str = t2.get()
    team1 = team1.split()
    team1[1] = f"{team1[0]} {team1[1]}"

    team2 = team2.split()
    team2[1] = f"{team2[0]} {team2[1]}"

    score_data = {
        'plant1': 0,
        'harvest1': 0,
        'store1': 0,
        'plant2': 0,
        'harvest2': 0,
        'store2': 0,
        'silos': [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
        'team1': team1,
        "team2": team2
    }
    
    updateFile(f"{score_data['plant1']*10+score_data['harvest1']*10+score_data['store1']*10}", "VData/score1.txt")
    updateFile(f"{score_data['plant2']*10+score_data['harvest2']*10+score_data['store2']*10}", "VData/score2.txt")
    updateFile(f"{team1[1]}", "VData/team1.txt")
    updateFile(f"{team2[1]}", "VData/team2.txt")
    

    asyncio.run_coroutine_threadsafe(broadcast_to_displays(json.dumps(score_data)), server_loop)
    
def run_gui():
    global root, controller_label, display_label

    root = tk.Tk()
    height = 430
    width = 280
    x = (root.winfo_screenwidth()//2)-(width//2)
    y = (root.winfo_screenheight()//2)-(height//2)
    root.geometry('{}x{}+{}+{}'.format(width,height,x,y))
    root.title("WebSocket Server")
    
    ip = ttk.Label(root, text=f"site: {IPAddr}:8821",font=('Ubuntu', 16, 'bold'))
    ip.pack()

    controller_label = ttk.Label(root, text="Controller Connections: 0", font=('Ubuntu', 16))
    controller_label.pack()

    display_label = ttk.Label(root, text="Display Connected: No", font=('Ubuntu', 16))
    display_label.pack()

    frame1 = ttk.Frame(root)

    ent1 = ttk.Entry(frame1)
    ent1.pack(side="left")

    ent2 = ttk.Entry(frame1)
    ent2.pack(side="right")

    frame1.pack()

    btt = ttk.Button(root, text="reset", command=lambda: reset(ent1, ent2))
    btt.pack()

    update_connections()

    root.mainloop()

def run_servers():
    global server_loop
    server_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(server_loop)

    try:
        server_loop.run_until_complete(asyncio.gather(start_controller(), start_display()))
    finally:
        server_loop.close()

gui_thread = threading.Thread(target=run_gui)
server_thread = threading.Thread(target=run_servers)

gui_thread.start()
server_thread.start()

gui_thread.join()
server_thread.join()