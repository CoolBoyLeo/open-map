# 🌍 Open Map - 开放地图平台

Open Map 是一个致力于共建 **开放地理数据资源库** 的开源项目，目标是使用统一的 GeoJSON 格式，聚合各类 POI（兴趣点）数据，如停车场、露营地、充电桩、公厕、洗车站等，为不同应用提供一致、标准、可复用的数据基础。

本项目以轻量化、可扩展的架构，支持在 Web、移动端、小程序、GIS 系统等任意应用中加载和展示数据。你可以将 Open Map 作为数据源中心，构建地图类产品或服务，也可以参与上传共享数据，共建地理信息生态。

---

## 🚩 项目核心目标

- ✅ **构建统一的 GeoJSON 数据仓库**  
  所有地理数据统一存放在 `data/` 目录下，每个 `.geojson` 文件代表一个主题分类（例如 `free_parking.geojson` 表示“免费停车场”，`camping_spots.geojson` 表示“露营地”）。所有文件遵循统一的 GeoJSON 结构，便于版本管理、多人协作和应用程序按需加载。

- 🌐 **支持多端、多平台接入**  
  支持任意支持 GeoJSON 的客户端或框架，如 Leaflet、Mapbox、Cesium、微信小程序等。

- 🔁 **快速复用与组合**  
  按需组合图层，实现不同主题地图（如“广东避暑好去处”、“免费洗车点地图”）。

- 🤝 **鼓励社区共建**  
  开放数据上传入口和命名规范，降低地图数据获取与可视化门槛。

---

## 📁 示例应用

以下是使用 Open Map 数据构建的典型应用场景：

### 📱 SKRSKR 地图 · 微信小程序示例

我们提供了一个基于微信小程序的客户端 —— **SKRSKR 地图**，作为 Open Map 数据接入的实践案例。功能包括：

- 多图层分类图标展示
- 地图标记点击弹出详情卡片
- 定位当前位置并计算与 POI 的距离（单位 km，保留两位小数）
- 支持地图缩放、拖动、拖拽式列表展开收起
- 拟态玻璃风 UI 风格，轻量美观

你可以扫码体验小程序：

<p align="center">
  <img src="clients/wechat-miniapp/weapp-qrcode.png" alt="SKRSKR 地图 - 微信小程序码" width="220" />
</p>

> 若你无法直接访问，可克隆本仓库并参考 [`/clients/wechat-miniapp`](clients/wechat-miniapp) 路径，自行部署或开发体验。

---

## 🌐 数据结构（GeoJSON）

每个数据文件应符合 GeoJSON 标准，示例：

```json
{
  "type": "FeatureCollection",
  "name": "商场免费停车",
  "icon": "🅿️",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [114.066868, 22.575424]
      },
      "properties": {
        "name": "华强北广场停车场",
        "address": "深圳市福田区振中路"
      }
    }
  ]
}
```

---
## 👐 用户贡献数据

我们鼓励社区用户贡献更多优质的地理数据，共建开放地图生态。  
详细的贡献数据格式规范、流程说明，请参见：[用户贡献数据说明](CONTRIBUTING_DATA.md) 。

