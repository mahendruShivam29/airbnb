/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 169.0, "minX": 0.0, "maxY": 24152.0, "series": [{"data": [[0.0, 169.0], [0.1, 315.0], [0.2, 364.0], [0.3, 364.0], [0.4, 398.0], [0.5, 510.0], [0.6, 512.0], [0.7, 641.0], [0.8, 708.0], [0.9, 710.0], [1.0, 774.0], [1.1, 774.0], [1.2, 904.0], [1.3, 936.0], [1.4, 936.0], [1.5, 1172.0], [1.6, 1173.0], [1.7, 1173.0], [1.8, 1265.0], [1.9, 1265.0], [2.0, 1417.0], [2.1, 1432.0], [2.2, 1432.0], [2.3, 1432.0], [2.4, 1433.0], [2.5, 1565.0], [2.6, 1632.0], [2.7, 1694.0], [2.8, 1703.0], [2.9, 1703.0], [3.0, 1725.0], [3.1, 1726.0], [3.2, 1727.0], [3.3, 1853.0], [3.4, 2017.0], [3.5, 2081.0], [3.6, 2169.0], [3.7, 2171.0], [3.8, 2277.0], [3.9, 2345.0], [4.0, 2346.0], [4.1, 2367.0], [4.2, 2367.0], [4.3, 2368.0], [4.4, 2368.0], [4.5, 2368.0], [4.6, 2374.0], [4.7, 2483.0], [4.8, 2484.0], [4.9, 2724.0], [5.0, 2841.0], [5.1, 2975.0], [5.2, 3030.0], [5.3, 3097.0], [5.4, 3098.0], [5.5, 3098.0], [5.6, 3098.0], [5.7, 3123.0], [5.8, 3203.0], [5.9, 3210.0], [6.0, 3245.0], [6.1, 3290.0], [6.2, 3353.0], [6.3, 3373.0], [6.4, 3542.0], [6.5, 3588.0], [6.6, 3624.0], [6.7, 3650.0], [6.8, 3675.0], [6.9, 3675.0], [7.0, 3747.0], [7.1, 3818.0], [7.2, 3936.0], [7.3, 3950.0], [7.4, 3953.0], [7.5, 3982.0], [7.6, 4045.0], [7.7, 4137.0], [7.8, 4138.0], [7.9, 4138.0], [8.0, 4139.0], [8.1, 4139.0], [8.2, 4140.0], [8.3, 4237.0], [8.4, 4241.0], [8.5, 4244.0], [8.6, 4247.0], [8.7, 4339.0], [8.8, 4379.0], [8.9, 4388.0], [9.0, 4389.0], [9.1, 4437.0], [9.2, 4471.0], [9.3, 4514.0], [9.4, 4518.0], [9.5, 4518.0], [9.6, 4597.0], [9.7, 4625.0], [9.8, 4631.0], [9.9, 4639.0], [10.0, 4640.0], [10.1, 4640.0], [10.2, 4721.0], [10.3, 4869.0], [10.4, 4869.0], [10.5, 4869.0], [10.6, 4916.0], [10.7, 4969.0], [10.8, 5115.0], [10.9, 5115.0], [11.0, 5116.0], [11.1, 5125.0], [11.2, 5125.0], [11.3, 5126.0], [11.4, 5263.0], [11.5, 5265.0], [11.6, 5265.0], [11.7, 5266.0], [11.8, 5290.0], [11.9, 5468.0], [12.0, 5493.0], [12.1, 5493.0], [12.2, 5762.0], [12.3, 5762.0], [12.4, 5762.0], [12.5, 5765.0], [12.6, 5765.0], [12.7, 5765.0], [12.8, 5765.0], [12.9, 5765.0], [13.0, 5765.0], [13.1, 5765.0], [13.2, 5788.0], [13.3, 5893.0], [13.4, 6064.0], [13.5, 6064.0], [13.6, 6191.0], [13.7, 6381.0], [13.8, 6385.0], [13.9, 6385.0], [14.0, 6386.0], [14.1, 6386.0], [14.2, 6387.0], [14.3, 6387.0], [14.4, 6387.0], [14.5, 6387.0], [14.6, 6387.0], [14.7, 6387.0], [14.8, 6388.0], [14.9, 6389.0], [15.0, 6390.0], [15.1, 6592.0], [15.2, 6682.0], [15.3, 6831.0], [15.4, 6831.0], [15.5, 6838.0], [15.6, 7080.0], [15.7, 7113.0], [15.8, 7163.0], [15.9, 7163.0], [16.0, 7163.0], [16.1, 7163.0], [16.2, 7166.0], [16.3, 7166.0], [16.4, 7166.0], [16.5, 7166.0], [16.6, 7168.0], [16.7, 7321.0], [16.8, 7370.0], [16.9, 7372.0], [17.0, 7477.0], [17.1, 7477.0], [17.2, 7477.0], [17.3, 7477.0], [17.4, 7477.0], [17.5, 7477.0], [17.6, 7477.0], [17.7, 7477.0], [17.8, 7480.0], [17.9, 7547.0], [18.0, 7705.0], [18.1, 7760.0], [18.2, 7760.0], [18.3, 7761.0], [18.4, 7763.0], [18.5, 8048.0], [18.6, 8048.0], [18.7, 8048.0], [18.8, 8048.0], [18.9, 8049.0], [19.0, 8049.0], [19.1, 8049.0], [19.2, 8049.0], [19.3, 8049.0], [19.4, 8050.0], [19.5, 8050.0], [19.6, 8051.0], [19.7, 8051.0], [19.8, 8249.0], [19.9, 8262.0], [20.0, 8262.0], [20.1, 8262.0], [20.2, 8285.0], [20.3, 8352.0], [20.4, 8464.0], [20.5, 8519.0], [20.6, 8541.0], [20.7, 8668.0], [20.8, 8675.0], [20.9, 8691.0], [21.0, 8695.0], [21.1, 8761.0], [21.2, 8763.0], [21.3, 8763.0], [21.4, 8763.0], [21.5, 8763.0], [21.6, 8763.0], [21.7, 8763.0], [21.8, 8764.0], [21.9, 8765.0], [22.0, 8765.0], [22.1, 8765.0], [22.2, 8765.0], [22.3, 8765.0], [22.4, 8814.0], [22.5, 8818.0], [22.6, 8937.0], [22.7, 8937.0], [22.8, 9058.0], [22.9, 9111.0], [23.0, 9117.0], [23.1, 9212.0], [23.2, 9212.0], [23.3, 9213.0], [23.4, 9213.0], [23.5, 9213.0], [23.6, 9213.0], [23.7, 9214.0], [23.8, 9215.0], [23.9, 9215.0], [24.0, 9216.0], [24.1, 9216.0], [24.2, 9217.0], [24.3, 9218.0], [24.4, 9219.0], [24.5, 9220.0], [24.6, 9221.0], [24.7, 9221.0], [24.8, 9234.0], [24.9, 9353.0], [25.0, 9391.0], [25.1, 9391.0], [25.2, 9391.0], [25.3, 9391.0], [25.4, 9391.0], [25.5, 9391.0], [25.6, 9392.0], [25.7, 9392.0], [25.8, 9392.0], [25.9, 9395.0], [26.0, 9396.0], [26.1, 9396.0], [26.2, 9396.0], [26.3, 9397.0], [26.4, 9397.0], [26.5, 9411.0], [26.6, 9562.0], [26.7, 9567.0], [26.8, 9569.0], [26.9, 9581.0], [27.0, 9590.0], [27.1, 9596.0], [27.2, 9597.0], [27.3, 9597.0], [27.4, 9598.0], [27.5, 9598.0], [27.6, 9598.0], [27.7, 9626.0], [27.8, 9633.0], [27.9, 9633.0], [28.0, 9633.0], [28.1, 9633.0], [28.2, 9633.0], [28.3, 9633.0], [28.4, 9634.0], [28.5, 9634.0], [28.6, 9634.0], [28.7, 9635.0], [28.8, 9636.0], [28.9, 9636.0], [29.0, 9636.0], [29.1, 9636.0], [29.2, 9640.0], [29.3, 9643.0], [29.4, 9713.0], [29.5, 9717.0], [29.6, 9717.0], [29.7, 9717.0], [29.8, 9717.0], [29.9, 9720.0], [30.0, 9721.0], [30.1, 9722.0], [30.2, 9724.0], [30.3, 9755.0], [30.4, 9787.0], [30.5, 9795.0], [30.6, 9805.0], [30.7, 9808.0], [30.8, 9808.0], [30.9, 9812.0], [31.0, 9814.0], [31.1, 9819.0], [31.2, 9820.0], [31.3, 9825.0], [31.4, 9994.0], [31.5, 9994.0], [31.6, 9995.0], [31.7, 9995.0], [31.8, 9997.0], [31.9, 9998.0], [32.0, 9999.0], [32.1, 9999.0], [32.2, 9999.0], [32.3, 10000.0], [32.4, 10001.0], [32.5, 10002.0], [32.6, 10002.0], [32.7, 10040.0], [32.8, 10084.0], [32.9, 10134.0], [33.0, 10140.0], [33.1, 10275.0], [33.2, 10275.0], [33.3, 10276.0], [33.4, 10276.0], [33.5, 10276.0], [33.6, 10277.0], [33.7, 10277.0], [33.8, 10277.0], [33.9, 10277.0], [34.0, 10278.0], [34.1, 10278.0], [34.2, 10278.0], [34.3, 10278.0], [34.4, 10317.0], [34.5, 10321.0], [34.6, 10412.0], [34.7, 10492.0], [34.8, 10500.0], [34.9, 10529.0], [35.0, 10529.0], [35.1, 10530.0], [35.2, 10530.0], [35.3, 10530.0], [35.4, 10530.0], [35.5, 10530.0], [35.6, 10530.0], [35.7, 10530.0], [35.8, 10530.0], [35.9, 10531.0], [36.0, 10531.0], [36.1, 10531.0], [36.2, 10532.0], [36.3, 10532.0], [36.4, 10533.0], [36.5, 10533.0], [36.6, 10533.0], [36.7, 10533.0], [36.8, 10577.0], [36.9, 10613.0], [37.0, 10700.0], [37.1, 10700.0], [37.2, 10700.0], [37.3, 10700.0], [37.4, 10700.0], [37.5, 10700.0], [37.6, 10700.0], [37.7, 10701.0], [37.8, 10701.0], [37.9, 10701.0], [38.0, 10702.0], [38.1, 10702.0], [38.2, 10702.0], [38.3, 10702.0], [38.4, 10703.0], [38.5, 10703.0], [38.6, 10703.0], [38.7, 10704.0], [38.8, 10710.0], [38.9, 10728.0], [39.0, 10736.0], [39.1, 10736.0], [39.2, 10746.0], [39.3, 10747.0], [39.4, 10747.0], [39.5, 10748.0], [39.6, 10756.0], [39.7, 10762.0], [39.8, 10763.0], [39.9, 10763.0], [40.0, 10765.0], [40.1, 10767.0], [40.2, 10768.0], [40.3, 10768.0], [40.4, 10769.0], [40.5, 10771.0], [40.6, 10774.0], [40.7, 10774.0], [40.8, 10780.0], [40.9, 10783.0], [41.0, 10788.0], [41.1, 10788.0], [41.2, 10828.0], [41.3, 10840.0], [41.4, 10842.0], [41.5, 10842.0], [41.6, 10842.0], [41.7, 10844.0], [41.8, 10844.0], [41.9, 10846.0], [42.0, 10848.0], [42.1, 10851.0], [42.2, 10859.0], [42.3, 10860.0], [42.4, 10862.0], [42.5, 10862.0], [42.6, 10862.0], [42.7, 10863.0], [42.8, 10864.0], [42.9, 10864.0], [43.0, 10865.0], [43.1, 10866.0], [43.2, 10866.0], [43.3, 10866.0], [43.4, 10866.0], [43.5, 10866.0], [43.6, 10866.0], [43.7, 10866.0], [43.8, 10866.0], [43.9, 10866.0], [44.0, 10866.0], [44.1, 10866.0], [44.2, 10866.0], [44.3, 10866.0], [44.4, 10867.0], [44.5, 10869.0], [44.6, 10872.0], [44.7, 10882.0], [44.8, 10896.0], [44.9, 10899.0], [45.0, 10907.0], [45.1, 10907.0], [45.2, 10907.0], [45.3, 10908.0], [45.4, 10908.0], [45.5, 10909.0], [45.6, 10909.0], [45.7, 10909.0], [45.8, 10910.0], [45.9, 10910.0], [46.0, 10910.0], [46.1, 10910.0], [46.2, 10922.0], [46.3, 10935.0], [46.4, 10936.0], [46.5, 10937.0], [46.6, 10963.0], [46.7, 10997.0], [46.8, 10997.0], [46.9, 10999.0], [47.0, 11004.0], [47.1, 11008.0], [47.2, 11026.0], [47.3, 11031.0], [47.4, 11033.0], [47.5, 11033.0], [47.6, 11033.0], [47.7, 11033.0], [47.8, 11033.0], [47.9, 11033.0], [48.0, 11034.0], [48.1, 11034.0], [48.2, 11035.0], [48.3, 11035.0], [48.4, 11036.0], [48.5, 11036.0], [48.6, 11043.0], [48.7, 11045.0], [48.8, 11047.0], [48.9, 11049.0], [49.0, 11064.0], [49.1, 11066.0], [49.2, 11067.0], [49.3, 11070.0], [49.4, 11072.0], [49.5, 11072.0], [49.6, 11073.0], [49.7, 11084.0], [49.8, 11085.0], [49.9, 11088.0], [50.0, 11090.0], [50.1, 11092.0], [50.2, 11094.0], [50.3, 11096.0], [50.4, 11096.0], [50.5, 11101.0], [50.6, 11101.0], [50.7, 11101.0], [50.8, 11101.0], [50.9, 11102.0], [51.0, 11102.0], [51.1, 11103.0], [51.2, 11103.0], [51.3, 11104.0], [51.4, 11104.0], [51.5, 11107.0], [51.6, 11110.0], [51.7, 11118.0], [51.8, 11118.0], [51.9, 11120.0], [52.0, 11121.0], [52.1, 11143.0], [52.2, 11144.0], [52.3, 11144.0], [52.4, 11144.0], [52.5, 11144.0], [52.6, 11144.0], [52.7, 11144.0], [52.8, 11144.0], [52.9, 11144.0], [53.0, 11145.0], [53.1, 11146.0], [53.2, 11147.0], [53.3, 11148.0], [53.4, 11153.0], [53.5, 11154.0], [53.6, 11158.0], [53.7, 11160.0], [53.8, 11160.0], [53.9, 11160.0], [54.0, 11166.0], [54.1, 11168.0], [54.2, 11169.0], [54.3, 11169.0], [54.4, 11170.0], [54.5, 11171.0], [54.6, 11171.0], [54.7, 11180.0], [54.8, 11203.0], [54.9, 11236.0], [55.0, 11243.0], [55.1, 11243.0], [55.2, 11243.0], [55.3, 11243.0], [55.4, 11245.0], [55.5, 11251.0], [55.6, 11251.0], [55.7, 11253.0], [55.8, 11255.0], [55.9, 11257.0], [56.0, 11258.0], [56.1, 11261.0], [56.2, 11264.0], [56.3, 11266.0], [56.4, 11283.0], [56.5, 11283.0], [56.6, 11284.0], [56.7, 11336.0], [56.8, 11337.0], [56.9, 11338.0], [57.0, 11386.0], [57.1, 11391.0], [57.2, 11396.0], [57.3, 11438.0], [57.4, 11656.0], [57.5, 11669.0], [57.6, 11751.0], [57.7, 11751.0], [57.8, 11752.0], [57.9, 11753.0], [58.0, 11837.0], [58.1, 11857.0], [58.2, 11857.0], [58.3, 11860.0], [58.4, 11874.0], [58.5, 11875.0], [58.6, 11876.0], [58.7, 11876.0], [58.8, 11877.0], [58.9, 11880.0], [59.0, 11882.0], [59.1, 11882.0], [59.2, 11883.0], [59.3, 11884.0], [59.4, 11884.0], [59.5, 11887.0], [59.6, 11888.0], [59.7, 11889.0], [59.8, 11890.0], [59.9, 11890.0], [60.0, 11891.0], [60.1, 11892.0], [60.2, 11895.0], [60.3, 11896.0], [60.4, 11896.0], [60.5, 11896.0], [60.6, 11897.0], [60.7, 11897.0], [60.8, 11897.0], [60.9, 11897.0], [61.0, 11897.0], [61.1, 11897.0], [61.2, 11898.0], [61.3, 11899.0], [61.4, 11899.0], [61.5, 11900.0], [61.6, 11901.0], [61.7, 11932.0], [61.8, 11937.0], [61.9, 11937.0], [62.0, 11953.0], [62.1, 11954.0], [62.2, 11982.0], [62.3, 11983.0], [62.4, 12001.0], [62.5, 12001.0], [62.6, 12003.0], [62.7, 12005.0], [62.8, 12117.0], [62.9, 12126.0], [63.0, 12126.0], [63.1, 12131.0], [63.2, 12135.0], [63.3, 12135.0], [63.4, 12136.0], [63.5, 12136.0], [63.6, 12136.0], [63.7, 12137.0], [63.8, 12138.0], [63.9, 12139.0], [64.0, 12151.0], [64.1, 12151.0], [64.2, 12224.0], [64.3, 12250.0], [64.4, 12262.0], [64.5, 12336.0], [64.6, 12337.0], [64.7, 12379.0], [64.8, 12380.0], [64.9, 12381.0], [65.0, 12381.0], [65.1, 12382.0], [65.2, 12382.0], [65.3, 12382.0], [65.4, 12383.0], [65.5, 12384.0], [65.6, 12385.0], [65.7, 12386.0], [65.8, 12389.0], [65.9, 12390.0], [66.0, 12391.0], [66.1, 12391.0], [66.2, 12391.0], [66.3, 12391.0], [66.4, 12391.0], [66.5, 12391.0], [66.6, 12392.0], [66.7, 12392.0], [66.8, 12393.0], [66.9, 12393.0], [67.0, 12394.0], [67.1, 12394.0], [67.2, 12395.0], [67.3, 12395.0], [67.4, 12397.0], [67.5, 12399.0], [67.6, 12466.0], [67.7, 12466.0], [67.8, 12467.0], [67.9, 12467.0], [68.0, 12467.0], [68.1, 12467.0], [68.2, 12468.0], [68.3, 12470.0], [68.4, 12485.0], [68.5, 12488.0], [68.6, 12490.0], [68.7, 12514.0], [68.8, 12515.0], [68.9, 12515.0], [69.0, 12516.0], [69.1, 12522.0], [69.2, 12526.0], [69.3, 12546.0], [69.4, 12549.0], [69.5, 12557.0], [69.6, 12603.0], [69.7, 12603.0], [69.8, 12603.0], [69.9, 12604.0], [70.0, 12605.0], [70.1, 12608.0], [70.2, 12612.0], [70.3, 12613.0], [70.4, 12614.0], [70.5, 12615.0], [70.6, 12620.0], [70.7, 12630.0], [70.8, 12633.0], [70.9, 12635.0], [71.0, 12637.0], [71.1, 12638.0], [71.2, 12641.0], [71.3, 12643.0], [71.4, 12643.0], [71.5, 12644.0], [71.6, 12644.0], [71.7, 12665.0], [71.8, 12700.0], [71.9, 12700.0], [72.0, 12704.0], [72.1, 12715.0], [72.2, 12721.0], [72.3, 12723.0], [72.4, 12723.0], [72.5, 12723.0], [72.6, 12724.0], [72.7, 12724.0], [72.8, 12724.0], [72.9, 12727.0], [73.0, 12727.0], [73.1, 12730.0], [73.2, 12749.0], [73.3, 12750.0], [73.4, 12750.0], [73.5, 12750.0], [73.6, 12751.0], [73.7, 12751.0], [73.8, 12752.0], [73.9, 12754.0], [74.0, 12754.0], [74.1, 12782.0], [74.2, 12783.0], [74.3, 12785.0], [74.4, 12786.0], [74.5, 12787.0], [74.6, 12789.0], [74.7, 12790.0], [74.8, 12803.0], [74.9, 12812.0], [75.0, 12812.0], [75.1, 12816.0], [75.2, 12827.0], [75.3, 12827.0], [75.4, 12828.0], [75.5, 12837.0], [75.6, 12838.0], [75.7, 12839.0], [75.8, 12840.0], [75.9, 12840.0], [76.0, 12840.0], [76.1, 12844.0], [76.2, 12892.0], [76.3, 12901.0], [76.4, 12901.0], [76.5, 12901.0], [76.6, 12901.0], [76.7, 12902.0], [76.8, 12903.0], [76.9, 12903.0], [77.0, 12903.0], [77.1, 12904.0], [77.2, 12904.0], [77.3, 12904.0], [77.4, 12904.0], [77.5, 12905.0], [77.6, 12906.0], [77.7, 12909.0], [77.8, 12909.0], [77.9, 12910.0], [78.0, 12910.0], [78.1, 12910.0], [78.2, 12911.0], [78.3, 12922.0], [78.4, 12927.0], [78.5, 12943.0], [78.6, 12951.0], [78.7, 12952.0], [78.8, 12956.0], [78.9, 12957.0], [79.0, 12957.0], [79.1, 12958.0], [79.2, 12986.0], [79.3, 13010.0], [79.4, 13015.0], [79.5, 13016.0], [79.6, 13034.0], [79.7, 13035.0], [79.8, 13049.0], [79.9, 13049.0], [80.0, 13050.0], [80.1, 13050.0], [80.2, 13050.0], [80.3, 13051.0], [80.4, 13051.0], [80.5, 13052.0], [80.6, 13053.0], [80.7, 13100.0], [80.8, 13102.0], [80.9, 13102.0], [81.0, 13102.0], [81.1, 13110.0], [81.2, 13112.0], [81.3, 13114.0], [81.4, 13116.0], [81.5, 13155.0], [81.6, 13156.0], [81.7, 13156.0], [81.8, 13157.0], [81.9, 13158.0], [82.0, 13160.0], [82.1, 13161.0], [82.2, 13163.0], [82.3, 13164.0], [82.4, 13194.0], [82.5, 13194.0], [82.6, 13195.0], [82.7, 13198.0], [82.8, 13198.0], [82.9, 13199.0], [83.0, 13199.0], [83.1, 13201.0], [83.2, 13201.0], [83.3, 13201.0], [83.4, 13202.0], [83.5, 13206.0], [83.6, 13208.0], [83.7, 13210.0], [83.8, 13210.0], [83.9, 13210.0], [84.0, 13211.0], [84.1, 13224.0], [84.2, 13225.0], [84.3, 13225.0], [84.4, 13226.0], [84.5, 13241.0], [84.6, 13320.0], [84.7, 13322.0], [84.8, 13322.0], [84.9, 13323.0], [85.0, 13323.0], [85.1, 13324.0], [85.2, 13325.0], [85.3, 13340.0], [85.4, 13344.0], [85.5, 13350.0], [85.6, 13350.0], [85.7, 13350.0], [85.8, 13351.0], [85.9, 13353.0], [86.0, 13353.0], [86.1, 13353.0], [86.2, 13353.0], [86.3, 13354.0], [86.4, 13354.0], [86.5, 13355.0], [86.6, 13365.0], [86.7, 13366.0], [86.8, 13366.0], [86.9, 13366.0], [87.0, 13366.0], [87.1, 13448.0], [87.2, 13459.0], [87.3, 13461.0], [87.4, 13471.0], [87.5, 13492.0], [87.6, 13496.0], [87.7, 13496.0], [87.8, 13502.0], [87.9, 13503.0], [88.0, 13504.0], [88.1, 13504.0], [88.2, 13505.0], [88.3, 13507.0], [88.4, 13511.0], [88.5, 13516.0], [88.6, 13518.0], [88.7, 13519.0], [88.8, 13519.0], [88.9, 13519.0], [89.0, 13520.0], [89.1, 13531.0], [89.2, 13534.0], [89.3, 13535.0], [89.4, 13535.0], [89.5, 13537.0], [89.6, 13540.0], [89.7, 13543.0], [89.8, 13581.0], [89.9, 13647.0], [90.0, 13672.0], [90.1, 13673.0], [90.2, 13674.0], [90.3, 13675.0], [90.4, 13675.0], [90.5, 13788.0], [90.6, 13790.0], [90.7, 13823.0], [90.8, 13823.0], [90.9, 13823.0], [91.0, 13823.0], [91.1, 13824.0], [91.2, 13824.0], [91.3, 13824.0], [91.4, 13842.0], [91.5, 13848.0], [91.6, 13850.0], [91.7, 13855.0], [91.8, 13857.0], [91.9, 13858.0], [92.0, 13861.0], [92.1, 13903.0], [92.2, 13903.0], [92.3, 13904.0], [92.4, 13904.0], [92.5, 13909.0], [92.6, 13909.0], [92.7, 13910.0], [92.8, 13911.0], [92.9, 13915.0], [93.0, 13916.0], [93.1, 14011.0], [93.2, 14014.0], [93.3, 14015.0], [93.4, 14020.0], [93.5, 14023.0], [93.6, 14023.0], [93.7, 14024.0], [93.8, 14024.0], [93.9, 14026.0], [94.0, 14031.0], [94.1, 14056.0], [94.2, 14085.0], [94.3, 14107.0], [94.4, 14110.0], [94.5, 14114.0], [94.6, 14115.0], [94.7, 14120.0], [94.8, 14121.0], [94.9, 14124.0], [95.0, 14152.0], [95.1, 14169.0], [95.2, 14169.0], [95.3, 14169.0], [95.4, 14171.0], [95.5, 14199.0], [95.6, 14200.0], [95.7, 14203.0], [95.8, 14204.0], [95.9, 14218.0], [96.0, 14220.0], [96.1, 14222.0], [96.2, 14223.0], [96.3, 14224.0], [96.4, 14224.0], [96.5, 14224.0], [96.6, 14224.0], [96.7, 14231.0], [96.8, 14398.0], [96.9, 14574.0], [97.0, 14588.0], [97.1, 14617.0], [97.2, 15096.0], [97.3, 15101.0], [97.4, 15106.0], [97.5, 15107.0], [97.6, 15382.0], [97.7, 15382.0], [97.8, 15383.0], [97.9, 16057.0], [98.0, 16764.0], [98.1, 17250.0], [98.2, 17256.0], [98.3, 17352.0], [98.4, 17698.0], [98.5, 17727.0], [98.6, 18374.0], [98.7, 20212.0], [98.8, 20650.0], [98.9, 20936.0], [99.0, 20954.0], [99.1, 21049.0], [99.2, 21490.0], [99.3, 21531.0], [99.4, 21547.0], [99.5, 21613.0], [99.6, 21770.0], [99.7, 21845.0], [99.8, 21920.0], [99.9, 24152.0]], "isOverall": false, "label": "Signup Request", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 1.0, "minX": 100.0, "maxY": 43.0, "series": [{"data": [[100.0, 1.0], [300.0, 4.0], [500.0, 2.0], [600.0, 1.0], [700.0, 4.0], [900.0, 3.0], [1100.0, 3.0], [1200.0, 2.0], [1400.0, 4.0], [1500.0, 1.0], [1600.0, 2.0], [1700.0, 5.0], [1800.0, 1.0], [2000.0, 2.0], [2100.0, 2.0], [2300.0, 8.0], [2200.0, 1.0], [2400.0, 3.0], [2800.0, 1.0], [2700.0, 1.0], [2900.0, 1.0], [3000.0, 5.0], [3100.0, 1.0], [3200.0, 4.0], [3300.0, 2.0], [3500.0, 2.0], [3600.0, 4.0], [3700.0, 1.0], [3800.0, 1.0], [3900.0, 4.0], [4000.0, 1.0], [4200.0, 4.0], [4300.0, 4.0], [4100.0, 6.0], [4500.0, 4.0], [4400.0, 2.0], [4600.0, 5.0], [4800.0, 3.0], [4700.0, 1.0], [4900.0, 2.0], [5100.0, 6.0], [5200.0, 5.0], [5400.0, 3.0], [5700.0, 11.0], [5800.0, 1.0], [6100.0, 1.0], [6000.0, 2.0], [6300.0, 14.0], [6600.0, 1.0], [6500.0, 1.0], [6800.0, 3.0], [7100.0, 10.0], [7000.0, 1.0], [7300.0, 3.0], [7400.0, 9.0], [7500.0, 1.0], [7700.0, 5.0], [8000.0, 13.0], [8600.0, 4.0], [8200.0, 5.0], [8500.0, 2.0], [8700.0, 13.0], [8400.0, 1.0], [8300.0, 1.0], [9100.0, 2.0], [8800.0, 2.0], [9000.0, 1.0], [9200.0, 18.0], [8900.0, 1.0], [9700.0, 12.0], [9500.0, 11.0], [9400.0, 1.0], [9300.0, 16.0], [9600.0, 17.0], [9800.0, 8.0], [10100.0, 2.0], [10000.0, 6.0], [10200.0, 13.0], [9900.0, 9.0], [10700.0, 42.0], [10400.0, 2.0], [10600.0, 1.0], [10300.0, 2.0], [10500.0, 21.0], [10800.0, 38.0], [11200.0, 19.0], [10900.0, 20.0], [11100.0, 43.0], [11000.0, 35.0], [11600.0, 2.0], [11400.0, 1.0], [11700.0, 4.0], [11300.0, 6.0], [11900.0, 9.0], [11800.0, 35.0], [12200.0, 3.0], [12100.0, 14.0], [12000.0, 4.0], [12300.0, 31.0], [12500.0, 9.0], [12600.0, 22.0], [12700.0, 30.0], [12400.0, 11.0], [13300.0, 25.0], [13000.0, 14.0], [12900.0, 30.0], [13100.0, 24.0], [12800.0, 16.0], [13200.0, 15.0], [13500.0, 21.0], [13600.0, 6.0], [13700.0, 2.0], [13400.0, 7.0], [13800.0, 14.0], [14000.0, 12.0], [14300.0, 1.0], [13900.0, 10.0], [14100.0, 13.0], [14200.0, 12.0], [14500.0, 2.0], [14600.0, 1.0], [15300.0, 3.0], [15100.0, 3.0], [15000.0, 1.0], [16000.0, 1.0], [17200.0, 2.0], [16700.0, 1.0], [17300.0, 1.0], [17600.0, 1.0], [17700.0, 1.0], [18300.0, 1.0], [20200.0, 1.0], [20900.0, 2.0], [21000.0, 1.0], [20600.0, 1.0], [21400.0, 1.0], [21500.0, 2.0], [21600.0, 1.0], [21700.0, 1.0], [21800.0, 1.0], [21900.0, 1.0], [24100.0, 1.0]], "isOverall": false, "label": "Signup Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 24100.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 5.0, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 976.0, "series": [{"data": [[0.0, 5.0]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [[1.0, 19.0]], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 976.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 56.24347826086954, "minX": 1.76418138E12, "maxY": 93.10020876826717, "series": [{"data": [[1.76418138E12, 70.6116838487973], [1.7641815E12, 56.24347826086954], [1.76418144E12, 93.10020876826717]], "isOverall": false, "label": "Traveler Signup Users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7641815E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 169.0, "minX": 1.0, "maxY": 13836.666666666668, "series": [{"data": [[2.0, 1265.0], [3.0, 794.0], [4.0, 772.5], [5.0, 1711.3333333333333], [6.0, 1504.5], [7.0, 1156.25], [8.0, 1326.3333333333335], [9.0, 2017.0], [10.0, 2017.0], [11.0, 1654.0], [12.0, 2187.0], [13.0, 2334.0], [14.0, 2373.3333333333335], [15.0, 2422.0], [16.0, 4139.0], [17.0, 2329.5], [18.0, 2866.666666666667], [19.0, 3459.3333333333335], [20.0, 5115.0], [21.0, 2784.0], [22.0, 5337.666666666667], [23.0, 3698.4], [24.0, 5765.0], [25.0, 3442.2], [26.0, 5765.0], [27.0, 3613.25], [28.0, 5765.0], [29.0, 4058.4], [30.0, 6282.333333333334], [31.0, 3983.8], [33.0, 6387.0], [32.0, 6387.0], [34.0, 3990.5], [35.0, 6387.0], [36.0, 4330.2], [37.0, 6389.0], [39.0, 4615.0], [38.0, 7008.4], [41.0, 7166.0], [40.0, 7166.0], [42.0, 4749.166666666667], [43.0, 7374.0], [44.0, 5710.333333333333], [45.0, 7477.0], [47.0, 5914.4], [46.0, 7477.0], [49.0, 8050.0], [48.0, 8050.0], [50.0, 5853.166666666667], [51.0, 8049.0], [53.0, 8049.0], [52.0, 8048.0], [54.0, 6659.6], [55.0, 8763.0], [57.0, 7391.875], [56.0, 8973.466666666665], [59.0, 9219.5], [58.0, 9217.5], [61.0, 9391.0], [60.0, 9334.333333333334], [62.0, 6558.555555555557], [63.0, 9392.0], [66.0, 8986.687499999996], [67.0, 9633.0], [65.0, 9396.0], [64.0, 9394.75], [70.0, 9029.066666666668], [71.0, 10160.92857142857], [69.0, 9636.0], [68.0, 9636.0], [74.0, 9543.0], [75.0, 10673.545454545454], [73.0, 10530.333333333334], [72.0, 10460.888888888887], [79.0, 10173.210526315786], [78.0, 10864.0], [77.0, 10794.437500000002], [76.0, 10700.0], [83.0, 10601.892857142857], [82.0, 11035.0], [81.0, 11840.461538461537], [80.0, 10908.166666666666], [86.0, 9871.307692307691], [87.0, 11149.999999999998], [85.0, 11217.894736842105], [84.0, 12330.833333333336], [90.0, 11407.439024390242], [91.0, 12372.90909090909], [89.0, 10863.25], [88.0, 11333.166666666668], [94.0, 11332.257142857143], [95.0, 13095.290322580648], [93.0, 12839.882352941175], [92.0, 13836.666666666668], [98.0, 12828.37704918033], [99.0, 13148.931506849314], [97.0, 13516.666666666668], [96.0, 12661.593749999996], [100.0, 12793.6], [1.0, 169.0]], "isOverall": false, "label": "Signup Request", "isController": false}, {"data": [[78.07899999999998, 10489.547999999997]], "isOverall": false, "label": "Signup Request-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 1433.8, "minX": 1.76418138E12, "maxY": 6872.9, "series": [{"data": [[1.76418138E12, 4172.4], [1.7641815E12, 3300.7], [1.76418144E12, 6872.9]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.76418138E12, 1811.6], [1.7641815E12, 1433.8], [1.76418144E12, 2985.266666666667]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7641815E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 8451.49484536082, "minX": 1.76418138E12, "maxY": 12588.225469728606, "series": [{"data": [[1.76418138E12, 8451.49484536082], [1.7641815E12, 8697.404347826083], [1.76418144E12, 12588.225469728606]], "isOverall": false, "label": "Signup Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7641815E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 8451.415807560137, "minX": 1.76418138E12, "maxY": 12588.204592901873, "series": [{"data": [[1.76418138E12, 8451.415807560137], [1.7641815E12, 8697.404347826083], [1.76418144E12, 12588.204592901873]], "isOverall": false, "label": "Signup Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7641815E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.004347826086956526, "minX": 1.76418138E12, "maxY": 0.8213058419243977, "series": [{"data": [[1.76418138E12, 0.8213058419243977], [1.7641815E12, 0.004347826086956526], [1.76418144E12, 0.28183716075156556]], "isOverall": false, "label": "Signup Request", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7641815E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 169.0, "minX": 1.76418138E12, "maxY": 24152.0, "series": [{"data": [[1.76418138E12, 17727.0], [1.7641815E12, 21920.0], [1.76418144E12, 24152.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.76418138E12, 315.0], [1.7641815E12, 169.0], [1.76418144E12, 9819.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.76418138E12, 13156.0], [1.7641815E12, 10866.0], [1.76418144E12, 14107.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.76418138E12, 17379.679999999993], [1.7641815E12, 10936.69], [1.76418144E12, 21560.2]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.76418138E12, 9569.0], [1.7641815E12, 9392.0], [1.76418144E12, 12394.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.76418138E12, 13535.0], [1.7641815E12, 10908.45], [1.76418144E12, 14231.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7641815E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 2841.0, "minX": 3.0, "maxY": 12956.5, "series": [{"data": [[8.0, 5265.0], [9.0, 9117.0], [10.0, 9717.0], [11.0, 5115.0], [3.0, 2841.0], [12.0, 12956.5], [13.0, 10276.0], [14.0, 11888.5], [15.0, 11111.5], [4.0, 5680.5], [16.0, 12904.0], [17.0, 11236.0], [18.0, 12903.0], [19.0, 12383.0], [5.0, 3711.0], [20.0, 10787.0], [21.0, 11118.0], [23.0, 6385.0], [6.0, 4635.0], [7.0, 12080.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 23.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 2841.0, "minX": 3.0, "maxY": 12956.5, "series": [{"data": [[8.0, 5265.0], [9.0, 9117.0], [10.0, 9717.0], [11.0, 5115.0], [3.0, 2841.0], [12.0, 12956.5], [13.0, 10276.0], [14.0, 11888.5], [15.0, 11111.5], [4.0, 5680.5], [16.0, 12904.0], [17.0, 11236.0], [18.0, 12903.0], [19.0, 12383.0], [5.0, 3711.0], [20.0, 10787.0], [21.0, 11118.0], [23.0, 6385.0], [6.0, 4635.0], [7.0, 12080.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 23.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 2.4833333333333334, "minX": 1.76418138E12, "maxY": 7.683333333333334, "series": [{"data": [[1.76418138E12, 6.5], [1.7641815E12, 2.4833333333333334], [1.76418144E12, 7.683333333333334]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7641815E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 3.8333333333333335, "minX": 1.76418138E12, "maxY": 7.983333333333333, "series": [{"data": [[1.76418138E12, 4.85], [1.7641815E12, 3.8333333333333335], [1.76418144E12, 7.983333333333333]], "isOverall": false, "label": "201", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7641815E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 3.8333333333333335, "minX": 1.76418138E12, "maxY": 7.983333333333333, "series": [{"data": [[1.76418138E12, 4.85], [1.7641815E12, 3.8333333333333335], [1.76418144E12, 7.983333333333333]], "isOverall": false, "label": "Signup Request-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7641815E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 3.8333333333333335, "minX": 1.76418138E12, "maxY": 7.983333333333333, "series": [{"data": [[1.76418138E12, 4.85], [1.7641815E12, 3.8333333333333335], [1.76418144E12, 7.983333333333333]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7641815E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -28800000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

