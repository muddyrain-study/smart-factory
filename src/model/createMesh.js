import * as THREE from "three";
import scene from "./scene";
import City from "./Mesh/City";

let city;
export default function createMesh() {
  // 创建城市
  city = new City(scene);
}

export function updateMesh(time) {
  // city?.update(time);
}
