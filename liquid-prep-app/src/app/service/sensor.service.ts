// <reference types="web-bluetooth" />
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  /**
   * The bluetoothName value is defined in the ESP32 BLE server sketch file.
   * The value should match to exactly to what is defined in the BLE server sketch file.
   * Otherwise the App won't be able to identify the BLE device.
   */
  private readonly bluetoothName = 'ESP32-LiquidPrep';
  private readonly serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  private readonly characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
  private device: any;
  private sensorValueSub: Subject<number>;
  private isConnected = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private http: HttpClient) {}

  private get sensorValueSubject(): Subject<number> {
    if (!this.sensorValueSub) {
      this.sensorValueSub = new Subject<number>();
    }
    return this.sensorValueSub;
  }

  public async connectBluetooth() {
    // Vendor code to filter only for Arduino or similar micro-controllers
    const filter = {
      usbVendorId: 0x2341,
      esp32: 0x1234,
      sample2: 0x12345678,
      device: 0x40080698, // Arduino UNO
      esp32test: 0x400806a8,
    };

    let sensorMoisturePercantage: number;
    /**
     * The bluetoothName value is defined in the ESP32 BLE server sketch file.
     * The value should match to exactly to what is defined in the BLE server sketch file.
     * Otherwise the App won't be able to identify the BLE device.
     */
    const bluetoothName = 'ESP32-LiquidPrep';

    /**
     * The serviceUUID and characteristicUUID are the values defined in the ESP32 BLE server sketch file.
     * These values should match to exactly to what is defined in the BLE server sketch file.
     * Otherwise the App won't be able to identify the BLE device.
     */
    const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

    let mobileNavigatorObject: any = window.navigator;

    if (!mobileNavigatorObject.bluetooth) {
      console.error('Web Bluetooth API is not available.');
      return;
    }

    try {
      const device = await mobileNavigatorObject.bluetooth.requestDevice({
        filters: [
          {
            name: this.bluetoothName,
          },
        ],
        optionalServices: [this.serviceUUID], // Required to access service later.
      });

      this.device = device;
      device.addEventListener(
        'gattserverdisconnected',
        this.onDisconnected.bind(this)
      );

      await this.connectToDevice();

      return sensorMoisturePercantage;
    } catch (e) {
      console.error('Failed to connect to sensor via Bluetooth:', e);
      throw e;
    }
  }

  private async connectToDevice() {
    if (!this.device) {
      throw new Error('No device selected');
    }

    const server = await this.device.gatt.connect();
    const service = await server.getPrimaryService(this.serviceUUID);
    const characteristic = await service.getCharacteristic(
      this.characteristicUUID
    );

    const value = await characteristic.readValue();
    const decoder = new TextDecoder('utf-8');
    const sensorMoisturePercantage = Number(decoder.decode(value));

    this.isConnected.next(true);
    this.reconnectAttempts = 0;
    return sensorMoisturePercantage;
  }

  private onDisconnected(event: Event) {
    console.log(`Device ${(event.target as any).name} is disconnected.`);
    this.isConnected.next(false);
    this.attemptReconnection();
  }

  private attemptReconnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(
        'Max reconnection attempts reached. Please restart the device.'
      );
      return;
    }

    console.log(
      `Attempting to reconnect... (Attempt ${this.reconnectAttempts + 1})`
    );
    timer(5000) // Wait for 5 seconds before attempting to reconnect
      .pipe(takeUntil(this.isConnected))
      .subscribe(async () => {
        try {
          await this.connectToDevice();
          console.log('Reconnection successful');
        } catch (error) {
          console.error('Reconnection failed:', error);
          this.reconnectAttempts++;
          this.attemptReconnection();
        }
      });
  }

  public getConnectionStatus() {
    return this.isConnected.asObservable();
  }
}
