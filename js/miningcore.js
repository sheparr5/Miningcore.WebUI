/*!
 * Miningcore.js v1.02
 * Copyright 2020 Authors (https://github.com/minernl/Miningcore)
 */

// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// Current running domain (or ip address) url will be read from the browser url bar.
// You can check the result in you browser development view -> F12 -> Console 
// -->> !! no need to change anything below here !! <<--
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------












// read WebURL from current browser
var WebURL = window.location.protocol + "//" + window.location.hostname + "/"; // Website URL is:  https://domain.com/
//var WebURL = "https://pool.flazzard.com";
// WebURL correction if not ends with /
if (WebURL.substring(WebURL.length - 1) != "/") {
    WebURL = WebURL + "/";
    console.log('Corrected WebURL, does not end with / -> New WebURL : ', WebURL);
}
//var API = WebURL + "api/";    
var API = "https://pool.flazzard.com/api/"; // API address is:  https://domain.com/api/
// API correction if not ends with /
if (API.substring(API.length - 1) != "/") {
    API = API + "/";
    console.log('Corrected API, does not end with / -> New API : ', API);
}
//var stratumAddress = window.location.hostname;           				// Stratum address is:  domain.com

var stratumAddress = "flazzard.com";
let stratumAddressPrefix = [
    "na",
    "pool"
];
let stratumConnectionInfo = [];







// --------------------------------------------------------------------------------------------
// no need to change anything below here
// --------------------------------------------------------------------------------------------
console.log('MiningCore.WebUI : ', WebURL); // Returns website URL
console.log('API address used : ', API); // Returns API URL
console.log('Stratum address  : ', "stratum+tcp://" + stratumAddress + ":"); // Returns Stratum URL
console.log('Page Load        : ', window.location.href); // Returns full URL

currentPage = "index"

// check browser compatibility
var nua = navigator.userAgent;
//var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
var is_IE = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Trident') > -1) && !(nua.indexOf('Chrome') > -1));
if (is_IE) {
    console.log('Running in IE browser is not supported - ', nua);
}

// Function to sort the home page table
function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("pool-coins");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /* Check if the two rows should switch place,
            based on the direction, asc or desc: */
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    // If so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    // Add arrow indicators to the table header
    var headers = table.getElementsByTagName('TH');
    for (var j = 0; j < headers.length; j++) {
        headers[j].innerHTML = headers[j].innerHTML.replace(/⏫|⏬/g, ''); // Remove existing arrows
    }
    var arrow = dir == 'asc' ? '⏫' : '⏬';
    headers[n].innerHTML += ' ' + arrow; // Add arrow to the sorted column header
}

// Load INDEX Page content
function loadIndex() {
    $("div[class^='page-").hide();

    $(".page").hide();
    //$(".page-header").show();
    $(".page-wrapper").show();
    $(".page-footer").show();

    var hashList = window.location.hash.split(/[#/?=]/);
    //var fullHash = document.URL.substr(document.URL.indexOf('#')+1);   //IE
    // example: #vtc/dashboard?address=VttsC2.....LXk9NJU
    currentPool = hashList[1];
    currentPage = hashList[2];
    currentAddress = hashList[3];

    if (currentPool && !currentPage) {
        currentPage = "stats"
    } else if (!currentPool && !currentPage) {
        currentPage = "index";
    }
    if (currentPool && currentPage) {
        loadNavigation();
        $(".main-index").hide();
        $(".main-pool").show();
        $(".page-" + currentPage).show();
        $(".main-sidebar").show();
    } else {
        $(".main-index").show();
        $(".main-pool").hide();
        $(".page-index").show();
        $(".main-sidebar").hide();
    }

    if (currentPool) {
        $("li[class^='nav-']").removeClass("active");

        switch (currentPage) {
            case "stats":
                console.log('Loading stats page content');
                $(".nav-stats").addClass("active");
                loadStatsPage();
                break;
            case "dashboard":
                console.log('Loading dashboard page content');
                $(".nav-dashboard").addClass("active");
                loadDashboardPage();
                break;
            case "miners":
                console.log('Loading miners page content');
                $(".nav-miners").addClass("active");
                loadMinersPage();
                break;
            case "blocks":
                console.log('Loading blocks page content');
                $(".nav-blocks").addClass("active");
                loadBlocksPage();
                break;
            case "payments":
                console.log('Loading payments page content');
                $(".nav-payments").addClass("active");
                loadPaymentsPage();
                break;
            case "connect":
                console.log('Loading connect page content');
                $(".nav-connect").addClass("active");
                loadConnectPage();
                loadStratumStatus();
                break;
            case "faq":
                console.log('Loading faq page content');
                $(".nav-faq").addClass("active");
                break;
            case "support":
                console.log('Loading support page content');
                $(".nav-support").addClass("active");
                break;
            default:
                // default if nothing above fits
        }
    } else {
        loadHomePage();
    }
    scrollPageTop();
}

// Factory function to create getTotalWorkersForAllPools instance
function createTotalWorkersCalculator() {
    return async function getTotalWorkersForAllPools(filteredData) {
        try {
            // Display loading indicator with three dots animation
            $('#loadingIndicator').html('<span class="loading-dot">.</span><span class="loading-dot">.</span><span class="loading-dot">.</span>');

            // Define a variable to track the animation
            let animationIndex = 0;
            const animationFrames = ['.', '..', '...'];

            let totalWorkers = 0;

            // Batch requests for all miners in each pool
            const batchedRequests = filteredData.map(async pool => {
                const poolName = pool.id;
                const minersData = await $.ajax(API + "pools/" + poolName + "/miners");
                const miners = minersData.map(miner => miner.miner);
                const workersPromises = miners.map(miner =>
                    $.ajax(API + "pools/" + poolName + "/miners/" + miner)
                );
                const workersDataArray = await Promise.all(workersPromises);

                // Reset totalWorkers for each pool
                let poolTotalWorkers = 0;

                workersDataArray.forEach(workersData => {
                    if (workersData.performance && workersData.performance.workers) {
                        poolTotalWorkers += Object.keys(workersData.performance.workers).length;
                    }
                });

                // Add poolTotalWorkers to totalWorkers
                totalWorkers += poolTotalWorkers;
            });

            await Promise.all(batchedRequests);

            // Hide loading indicator
            $('#loadingIndicator').text('');

            return totalWorkers;
        } catch (error) {
            // Hide loading indicator on error
            $('#loadingIndicator').text('');

            $.notify({
                message: "Error: No response from API.<br>(getTotalWorkersForAllPools)"
            }, {
                type: "danger",
                timer: 3000
            });
            console.error("AJAX Error:", error.statusText); // Log AJAX error
            throw new Error("Error: No response from API");
        }
    };
}
/*
// Load HOME page content
function loadHomePage(){
	console.log('Loading Mining Pool Stats Page...');
	$.ajax(API + "pools")
	.done(function (data) {
		const poolCoinCardTemplate = $(".index-coin-card-template").html();
		var poolCoinTableTemplate = "";
  
          var poolTotalMiners = 0;

          // Algorithm filter button or dropdown
          var algorithmFilter = "<select id='algorithmFilter' style='font-size: 17px;'><option value=''>Algorithm: All</option>";
          // Extract unique algorithms from the data
          var algorithms = [...new Set(data.pools.map(pool => pool.coin.algorithm))];
          algorithms.forEach(algorithm => {
              algorithmFilter += "<option value='" + algorithm + "'>" + algorithm + "</option>";
          });
          algorithmFilter += "</select>";

          // Add the filter above the table
          $(".filter-container").html(algorithmFilter);

          // Function to filter data based on algorithm
          function filterDataByAlgorithm(algorithm) {
              return (algorithm === '') ? data.pools : data.pools.filter(pool => pool.coin.algorithm === algorithm);
          }

          // Render the table with filtered data
          async function renderTable(filteredData) {
              poolCoinTableTemplate = "";
              poolTotalMiners = 0;

		$.each(data.pools, function(index, value)
		{
			var coinLogo = "<img class='coinimg' src='../../img/coin/icon/" + value.coin.type.toLowerCase() + ".png' style='height: 25px; width: 25px;' />";
			var coinName = (value.coin.canonicalName) ? value.coin.canonicalName : value.coin.name;
			if (typeof coinName === "undefined" || coinName === null) coinName = value.coin.type;
			var LastPoolBlockTime = new Date(value.lastPoolBlockTime);
			var styledTimeAgo = renderTimeAgoBox(LastPoolBlockTime);
			var coin_symbol = value.coin.symbol;
			var payoutSchemeColor = (value.paymentProcessing.payoutScheme.toUpperCase() === 'PPLNS') ? '#39f' : ((value.paymentProcessing.payoutScheme.toUpperCase() === 'SOLO') ? '#ff1666' : 'black');
			var coinNameWithTag = (value.paymentProcessing.payoutScheme.toUpperCase() === 'SOLO') ? coinName + ' [SOLO]' : coinName;
			var pool_mined = true;
			var pool_networkstat_hash = "&nbsp;processing...&nbsp;";
			var pool_networkstat_diff = "&nbsp;processing...&nbsp;";
			var pool_networkstat_blockheight = "&nbsp;processing...&nbsp;";
			var pool_stat_miner = "&nbsp;processing...&nbsp;";
			var pool_stat_hash = "&nbsp;processing...&nbsp;";
			var pool_netWorkShare = "&nbsp;processing...&nbsp;";
			if(value.hasOwnProperty('networkStats'))
			{
				pool_networkstat_hash = _formatter(value.networkStats.networkHashrate, 3, "H/s");
				pool_networkstat_diff = _formatter(value.networkStats.networkDifficulty, 6, "");
				pool_networkstat_blockheight = Intl.NumberFormat().format(value.networkStats.blockHeight);
				pool_stat_miner = value.poolStats.connectedMiners;
				pool_stat_hash = _formatter(value.poolStats.poolHashrate, 3, "H/s");
				var netWorkShare = (value.poolStats.poolHashrate / value.networkStats.networkHashrate * 100).toFixed(2);
				pool_netWorkShare = '<div class="progress"><div class="progress-bar progress-bar-orange progress-bar-striped" role="progressbar" style="width: ' + netWorkShare + '%;" aria-valuenow="' + netWorkShare + '" aria-valuemin="0" aria-valuemax="100">' + netWorkShare + '%</div></div>';
				pool_mined = false;
			}
			if(!pool_mined)
			{
				poolCoinTableTemplate += "<tr class='coin-table-row' href='#" + value.id + "'>";
				poolCoinTableTemplate += "<td class='coin' style='text-align: center;'><a href='#" + value.id + "' style='text-decoration: none;'>" + coinLogo + coinNameWithTag + "</a></td>";
			}
			else
			{
				poolCoinTableTemplate += "<tr class='coin-table-row'>";
				poolCoinTableTemplate += "<td class='coin' style='text-align: center;'>" + coinLogo + coinNameWithTag + "</td>";
			}
			poolCoinTableTemplate += "<td class='symbol' style='text-align: center;'>" + coin_symbol + "</td>";
			poolCoinTableTemplate += "<td class='algo' style='text-align: center;'>" + value.coin.algorithm + "</td>";
			poolCoinTableTemplate += "<td class='fee' style='text-align: center;'><span style='color: white;'>" + value.poolFeePercent + " % </span><br/><span style='color: " + payoutSchemeColor + ";'>" + value.paymentProcessing.payoutScheme.toUpperCase() + "</span></td>";
			poolCoinTableTemplate += "<td class='minimum-payment' style='text-align: center; '>" + value.paymentProcessing.minimumPayment.toLocaleString() + "</td>";
			poolCoinTableTemplate += "<td class='miners' style='text-align: center;'>" + pool_stat_miner + "</td>";
			poolCoinTableTemplate += "<td class='pool-hash' style='text-align: center;'>" + pool_stat_hash + "</td>";
			poolCoinTableTemplate += "<td class='net-share' style='text-align: center;'>" + pool_netWorkShare + "</td>";
			poolCoinTableTemplate += "<td class='net-hash' style='text-align: center;'>" + pool_networkstat_hash + "</td>";
			poolCoinTableTemplate += "<td class='net-diff' style='text-align: center;'>" + pool_networkstat_diff + "</td>";
			poolCoinTableTemplate += "<td class='blockheight' style='text-align: center;'>" + pool_networkstat_blockheight + "</td>";
			poolCoinTableTemplate += "<td class='timeAgo' style='text-align: center;'>" + styledTimeAgo + "</td>";
			poolCoinTableTemplate += "</tr>";
		});
		$(".pool-coin-table").html(poolCoinTableTemplate);

		$(document).ready(function() 
		{
			$('#pool-coins tr').click(function() 
			{
				var href = $(this).find("a").attr("href");
				if(href) 
				{
					window.location = href;
				}
			});
		});
	})
	.fail(function ()
	{
		var poolCoinTableTemplate = "";
		poolCoinTableTemplate += "<tr><td colspan='8'>";
		poolCoinTableTemplate += "<div class='alert alert-warning text-center'>"
		poolCoinTableTemplate += "<h4><i class='fas fa-exclamation-triangle'></i> Warning!</h4>";
		poolCoinTableTemplate += "<hr>";
		poolCoinTableTemplate += "<p>The pool is currently down for maintenance.</p>";
		poolCoinTableTemplate += "<p>Please try again later.</p>";
		poolCoinTableTemplate += "</div>"
		poolCoinTableTemplate += "</td></tr>";

		$(".pool-coin-table").html(poolCoinTableTemplate);
	});
}
*/
// Load HOME page content
function loadHomePage() {
    console.log('Loading Mining Pool Stats Page...');
    $.ajax(API + "pools")
        .done(function(data) {
            const poolCoinCardTemplate = $(".index-coin-card-template").html();
            var poolCoinTableTemplate = "";
            var poolTotalMiners = 0;

            // Algorithm filter button or dropdown
            var algorithmFilter = "<select id='algorithmFilter' style='font-size: 17px;'><option value=''>Algorithm: All</option>";
            // Extract unique algorithms from the data
            var algorithms = [...new Set(data.pools.map(pool => pool.coin.algorithm))];
            algorithms.forEach(algorithm => {
                algorithmFilter += "<option value='" + algorithm + "'>" + algorithm + "</option>";
            });
            algorithmFilter += "</select>";

            // Add the filter above the table
            $(".filter-container").html(algorithmFilter);

            // Function to filter data based on algorithm
            function filterDataByAlgorithm(algorithm) {
                return (algorithm === '') ? data.pools : data.pools.filter(pool => pool.coin.algorithm === algorithm);
            }

            // Render the table with filtered data
            async function renderTable(filteredData) {
                poolCoinTableTemplate = "";
                poolTotalMiners = 0;

                $.each(filteredData, function(index, value) {
                    var coinLogo = "<img class='coinimg' src='../../img/coin/icon/" + value.coin.type.toLowerCase() + ".png' style='height: 25px; width: 25px;' />";
                    var coinName = (value.coin.canonicalName) ? value.coin.canonicalName : value.coin.name;
                    if (typeof coinName === "undefined" || coinName === null) coinName = value.coin.type;
                    var LastPoolBlockTime = new Date(value.lastPoolBlockTime);
                    var styledTimeAgo = renderTimeAgoBox(LastPoolBlockTime);
                    var coin_symbol = value.coin.symbol;
                    var payoutSchemeColor = (value.paymentProcessing.payoutScheme.toUpperCase() === 'PPLNS') ? '#39f' : ((value.paymentProcessing.payoutScheme.toUpperCase() === 'SOLO') ? '#ff1666' : 'black');
                    var coinNameWithTag = (value.paymentProcessing.payoutScheme.toUpperCase() === 'SOLO') ? coinName + ' [SOLO]' : coinName;
                    var pool_mined = true;
                    var pool_networkstat_hash = "&nbsp;processing...&nbsp;";
                    var pool_networkstat_diff = "&nbsp;processing...&nbsp;";
                    var pool_networkstat_blockheight = "&nbsp;processing...&nbsp;";
                    var pool_stat_miner = "&nbsp;processing...&nbsp;";
                    var pool_stat_hash = "&nbsp;processing...&nbsp;";
                    var pool_netWorkShare = "&nbsp;processing...&nbsp;";
                    if (value.hasOwnProperty('networkStats')) {
                        pool_networkstat_hash = _formatter(value.networkStats.networkHashrate, 3, "H/s");
                        pool_networkstat_diff = _formatter(value.networkStats.networkDifficulty, 6, "");
                        pool_networkstat_blockheight = Intl.NumberFormat().format(value.networkStats.blockHeight);
                        pool_stat_miner = value.poolStats.connectedMiners;
                        poolTotalMiners += pool_stat_miner;
                        pool_stat_hash = _formatter(value.poolStats.poolHashrate, 3, "H/s");
                        var netWorkShare = (value.poolStats.poolHashrate / value.networkStats.networkHashrate * 100).toFixed(2);
                        pool_netWorkShare = '<div class="progress"><div class="progress-bar progress-bar-orange progress-bar-striped" role="progressbar" style="width: ' + netWorkShare + '%;" aria-valuenow="' + netWorkShare + '" aria-valuemin="0" aria-valuemax="100">' + netWorkShare + '%</div></div>';
                        pool_mined = false;
                    }
                    if (!pool_mined) {
                        poolCoinTableTemplate += "<tr class='coin-table-row' href='#" + value.id + "'>";
                        poolCoinTableTemplate += "<td class='coin' style='text-align: center;'><a href='#" + value.id + "' style='text-decoration: none;'>" + coinLogo + coinNameWithTag + "</a></td>";
                    } else {
                        poolCoinTableTemplate += "<tr class='coin-table-row'>";
                        poolCoinTableTemplate += "<td class='coin' style='text-align: center;'>" + coinLogo + coinNameWithTag + "</td>";
                    }
                    poolCoinTableTemplate += "<td class='symbol' style='text-align: center;'>" + coin_symbol + "</td>";
                    poolCoinTableTemplate += "<td class='algo' style='text-align: center;'>" + value.coin.algorithm + "</td>";
                    poolCoinTableTemplate += "<td class='fee' style='text-align: center;'><span style='color: white;'>" + value.poolFeePercent + " % </span><br/><span style='color: " + payoutSchemeColor + ";'>" + value.paymentProcessing.payoutScheme.toUpperCase() + "</span></td>";
                    poolCoinTableTemplate += "<td class='minimum-payment' style='text-align: center; '>" + value.paymentProcessing.minimumPayment.toLocaleString() + "</td>";
                    poolCoinTableTemplate += "<td class='miners' style='text-align: center;'>" + pool_stat_miner + "</td>";
                    poolCoinTableTemplate += "<td class='pool-hash' style='text-align: center;'>" + pool_stat_hash + "</td>";
                    poolCoinTableTemplate += "<td class='net-share' style='text-align: center;'>" + pool_netWorkShare + "</td>";
                    poolCoinTableTemplate += "<td class='net-hash' style='text-align: center;'>" + pool_networkstat_hash + "</td>";
                    poolCoinTableTemplate += "<td class='net-diff' style='text-align: center;'>" + pool_networkstat_diff + "</td>";
                    poolCoinTableTemplate += "<td class='blockheight' style='text-align: center;'>" + pool_networkstat_blockheight + "</td>";
                    poolCoinTableTemplate += "<td class='timeAgo' style='text-align: center;'>" + styledTimeAgo + "</td>";
                    poolCoinTableTemplate += "</tr>";
                });

                // Update total miners count
                $("#poolTotalMiners").text(poolTotalMiners);
                // Update total coins count
                $("#poolTotalCoins").text(filteredData.length);
                // Update the total workers count for the filtered data
                // Update the total workers count for the filtered data
                const getTotalWorkers = createTotalWorkersCalculator(); // Create an instance of getTotalWorkersForAllPools
                getTotalWorkers(filteredData) // Invoke the returned function
                    .then(function(totalWorkers) {
                        console.log("Total Workers:", totalWorkers);
                        $("#poolTotalWorkers").text(totalWorkers);
                    })
                    .catch(function(error) {
                        console.error(error);
                    });

                // Update the table content
                $(".pool-coin-table").html(poolCoinTableTemplate);
                sortTable(0);
            }

            // Render the table initially with all data
            renderTable(data.pools);

            // Event listener for algorithm filter change
            $("#algorithmFilter").change(function() {
                var selectedAlgorithm = $(this).val();
                var filteredData = filterDataByAlgorithm(selectedAlgorithm);
                renderTable(filteredData);
            });

            // Click event listener for table rows
            $(".pool-coin-table").html(poolCoinTableTemplate);
            sortTable(0);
            $(document).ready(function() {
                $('#pool-coins tr').click(function() {
                    var href = $(this).find("a").attr("href");
                    if (href) {
                        window.location = href;
                    }
                });
            });
        })
        .fail(function() {
            var poolCoinTableTemplate = "";
            poolCoinTableTemplate += "<tr><td colspan='12'>";
            poolCoinTableTemplate += "<div class='alert alert-warning text-center'>"
            poolCoinTableTemplate += "<h4><i class='fas fa-exclamation-triangle'></i> Warning!</h4>";
            poolCoinTableTemplate += "<hr>";
            poolCoinTableTemplate += "<p>The pool is currently down for maintenance.</p>";
            poolCoinTableTemplate += "<p>Please try again later.</p>";
            poolCoinTableTemplate += "</div>"
            poolCoinTableTemplate += "</td></tr>";

            $(".pool-coin-table").html(poolCoinTableTemplate);
        });
}

// Load STATS page content
function loadStatsPage() {
    //clearInterval();
    setInterval(
        (function load() {
            loadStatsData();
            return load;
        })(),
        60000
    );
    setInterval(
        (function load() {
            loadStatsChart();
            return load;
        })(),
        600000
    );
}


// Load DASHBOARD page content
function loadDashboardPage() {
    function render() {
        //clearInterval();
        setInterval(
            (function load() {
                loadDashboardData($("#walletAddress").val());
                loadDashboardWorkerList($("#walletAddress").val());
                loadDashboardChart($("#walletAddress").val());
                loadMinerPaymentThreshold($("#walletAddress").val());
                loadMinerDailyEarnings($("#walletAddress").val());
                loadDashboardBlocksPage($("#walletAddress").val());
                return load;
            })(),
            60000
        );
    }
    var walletQueryString = window.location.hash.split(/[#/?]/)[3];
    if (walletQueryString) {
        var wallet = window.location.hash.split(/[#/?]/)[3].replace("address=", "");
        if (wallet) {
            $(walletAddress).val(wallet);
            localStorage.setItem(currentPool + "-walletAddress", wallet);
            render();
        }
    }
    if (localStorage[currentPool + "-walletAddress"]) {
        $("#walletAddress").val(localStorage[currentPool + "-walletAddress"]);
    }
}

/*
// Load MINERS page content
function loadMinersPage() {
  return $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=20")
    .done(function(data) {
      var minerList = "";
      if (data.length > 0) {
        $.each(data, function(index, value) {
          minerList += "<tr>";
          //minerList +=   "<td>" + value.miner + "</td>";
		  minerList +=   '<td>' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
          //minerList += '<td><a href="' + value.minerAddressInfoLink + '" target="_blank">' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
          minerList += "<td>" + _formatter(value.hashrate, 5, "H/s") + "</td>";
          minerList += "<td>" + _formatter(value.sharesPerSecond, 5, "S/s") + "</td>";
          minerList += "</tr>";
        });
      } else {
        minerList += '<tr><td colspan="4">No miner connected</td></tr>';
      }
      $("#minerList").html(minerList);
    })
    .fail(function() {
      $.notify(
        {
          message: "Error: No response from API.<br>(loadMinersList)"
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}
*/
// Load MINERS page content
/*function loadMinersPage() {
  return $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=20")
    .done(function (data) {
      var minerList = "";
      if (data.length > 0) {
        $.each(data, function (index, value) {
          // Load miner workers asynchronously
          $.ajax(API + "pools/" + currentPool + "/miners/" + value.miner)
            .done(function (minerData) {
              var totalHashrate = 0;
              var totalSharesPerSecond = 0;
              // Check if minerData.performance.workers is empty or null
              if (minerData.performance && minerData.performance.workers) {
                // Iterate through each worker
                Object.values(minerData.performance.workers).forEach(function(worker) {
                  // Add the hashrate of the worker to the totalHashrate
                  totalHashrate += worker.hashrate;
                  // Add the shares per second of the worker to the totalSharesPerSecond
                  totalSharesPerSecond += worker.sharesPerSecond;
                });
              }

              minerList += "<tr>";
              //minerList +=   "<td>" + value.miner + "</td>";
              minerList += '<td>' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
              //minerList += '<td><a href="' + value.minerAddressInfoLink + '" target="_blank">' + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + '</td>';
              minerList += "<td>" + _formatter(totalHashrate, 5, "H/s") + "</td>";
              minerList += "<td>" + _formatter(totalSharesPerSecond, 5, "S/s") + "</td>";
              minerList += "</tr>";

              // Update the miner list on the page after all miners' data have been processed
              if(index === data.length - 1) {
                $("#minerList").html(minerList);
              }
            })
            .fail(function () {
              $.notify(
                {
                  message: "Error: No response from API for miner data."
                },
                {
                  type: "danger",
                  timer: 3000
                }
              );
            });
        });
      } else {
        minerList += '<tr><td colspan="4">No miner connected</td></tr>';
        $("#minerList").html(minerList);
      }
    })
    .fail(function () {
      $.notify(
        {
          message: "Error: No response from API for miners list."
        },
        {
          type: "danger",
          timer: 3000
        }
      );
    });
}*/

function loadMinersPage() {
    return $.ajax(API + "pools/" + currentPool)
        .done(function(data) {
            var minerList = "";
            var topMiners = data.pool.topMiners; // Access topMiners array within the pool object
            if (topMiners.length > 0) {
                $.each(topMiners, function(index, value) {
                    minerList += "<tr>";
                    minerList += "<td>" + value.miner.substring(0, 12) + ' &hellip; ' + value.miner.substring(value.miner.length - 12) + "</td>";
                    // minerList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.miner.substring(0, 12) + " &hellip; " + value.miner.substring(value.address.length - 12) + "</a></td>";
                    minerList += "<td>" + _formatter(value.hashrate, 5, "H/s") + "</td>";
                    minerList += "<td>" + _formatter(value.sharesPerSecond, 5, "S/s") + "</td>";
                    minerList += "</tr>";
                });
            } else {
                minerList += '<tr><td colspan="4">No top miners found</td></tr>';
            }
            $("#minerList").html(minerList);
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadMinersList)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}
/*
// Load BLOCKS page content
function loadBlocksPage() 
{
	//console.log("loadBlocksPage");
	return $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=100")
    .done(function (data) {
		var blockList = "";
		var newBlockList = "";
		var newBlockCount = 0;
		var pendingBlockList = "";
		var pendingBlockCount = 0;
		var confirmedBlockCount = 0;
		// Reset minerBlocks before populating again
		minerBlocks = {};
		if (data.length > 0) 
		{
			$.each(data, function (index, value) 
			{
				var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
				var effort = Math.round(value.effort * 100);
				var effortClass = "";
				var ServerFlag = "<img class='serverimg small-server-image' src='img/coin/" + value.source + ".png' />";

				if (effort < 100) 
				{
					effortClass = "effort1";
				} 
				else if (effort < 200) 
				{
					effortClass = "effort2";
				} 
				else  
				{
					effortClass = "effort3";
				} 

				var status = value.status;
				var blockTable = (status === "pending" && value.confirmationProgress === 0) ? newBlockList : pendingBlockList && (status === "pending") ? pendingBlockList : blockList;
				var timeAgo = getTimeAgo(createDate); // Calculate the time difference

				blockTable += "<tr>";
				blockTable += "<td title='" + createDate + "'>" + timeAgo + "</td>";
				blockTable += "<td>" + value.miner.substring(0, 8) + " &hellip; " + value.miner.substring(value.miner.length - 8) + "</td>";
				blockTable += "<td><a href='" + value.infoLink + "' target='_blank'>" + Intl.NumberFormat().format(value.blockHeight) + "</a></td>";
	
				blockTable += "<td>" + _formatter(value.networkDifficulty, 5, "") + "</td>";
				if (typeof value.effort !== "undefined") 
				{
					blockTable += "<td class='" + effortClass + "'>" + effort + "%</td>";
				} 
				else 
				{
					blockTable += "<td>Calculating...</td>";
				}
				// Block object for each block
				var block = {
					timeAgo: timeAgo,
					blockHeight: value.blockHeight,
					miner: value.miner,
					networkDifficulty: value.networkDifficulty.toFixed(8),
					effortClass: effortClass,
					status: value.status,
					progressValue: progressValue,
				};
				if (status === "pending") 
				{
					if (value.confirmationProgress === 0) 
					{
						block.reward = "Waiting...";
						blockTable += "<td>Waiting...</td>";
						blockTable += "<td>New Block</td>";
						newBlockCount++;
					} 
					else 
					{
						block.reward = "Waiting...";
						blockTable += "<td>Waiting...</td>";
						if (value.type =="uncle") blockTable += "<td>" + "Uncle" + "</td>";
						else if (status === "orphaned") blockTable += "<td>" + "Orphaned" + "</td>";
						else blockTable += "<td>" + "Pending" + "</td>";
						pendingBlockCount++;
					}
				} 
				else if (status === "confirmed") 
				{
					block.reward = Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0}).format(value.reward);
					blockTable += "<td>" + Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0}).format(value.reward) + "</td>";
					blockTable += "<td>" + "Confirmed" + "</td>";
					confirmedBlockCount++;
				} 
				else if (status === "orphaned") 
				{
					block.reward = Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0}).format(value.reward);
					blockTable += "<td>" + Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0}).format(value.reward) + "</td>";
					blockTable += "<td>" + "Orphaned" + "</td>";
				} 
				else 
				{
					blockTable += status;
				}
				// Populate minerBlocks based on the miner value
				if (!minerBlocks[value.miner]) 
				{
					minerBlocks[value.miner] = [];
				}
				minerBlocks[value.miner].push(block);
				var progressValue = (currentPool.includes("woodcoin")) ? Math.min(Math.round(value.confirmationProgress * 6 * 100), 100) : Math.round(value.confirmationProgress * 100);
				blockTable += "<td><div class='progress-bar bg-green progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='" + progressValue + "' aria-valuemin='0' aria-valuemax='100' style='width: " + progressValue + "%'><span>" + progressValue + "% Completed</span></div></td>";
				blockTable += "</tr>";

				if (status === "pending") 
				{
					if (value.confirmationProgress === 0) 
					{
						newBlockList = blockTable;
					}
					else 
					{
						pendingBlockList = blockTable;
					}
				} else {
					blockList = blockTable ;
				}
			});
		} else {
			blockList += '<tr><td colspan="8">No blocks found yet</td></tr>';
		}
		$("#blockList").html(blockList);
		$("#newBlockList").html(newBlockList);
		$("#newBlockCount").text(newBlockCount);
		$("#pendingBlockList").html(pendingBlockList);
		$("#pendingBlockCount").text(pendingBlockCount);
		$("#confirmedBlockCount").text(confirmedBlockCount);
		loadStatsData();
	})
	.fail(function () {
		$.notify(
			{
				message: "Error: No response from API.<br>(loadBlocksList)"
			},
			{
				type: "danger",
				timer: 3000
			}
		);
	});
}
*/
// Load BLOCKS page content
function loadBlocksPage() {
    //console.log("loadBlocksPage");
    return $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=500")
        .done(function(data) {
            var blockList = "";
            var newBlockList = "";
            var newBlockCount = 0;
            var pendingBlockList = "";
            var pendingBlockCount = 0;
            var confirmedBlockCount = 0;
            // Reset minerBlocks before populating again
            minerBlocks = {};
            if (data.length > 0) {
                $.each(data, function(index, value) {
                    var createDate = convertUTCDateToLocalDate(new Date(value.created), false);


                    // Alephium (family)
                    if (currentPool == "alephium") {
                        effort = Number(value.effort) * Math.pow(2, 30) * 100;
                        // Bitcoin (family)
                    } else if (currentPool == "bitcoin") {
                        // Vertcoin (coin)
                        if (currentPool == "Vertcoin") {
                            effort = (Number(value.effort) / 256) * 100;
                            // VishAI (coin)
                        } else if (currentPool == "Vishai") {
                            effort = (Number(value.effort) / 65536) * 100;
                        } else {
                            effort = Number(value.effort) * 100;
                        }
                        // Kaspa (family)
                    } else if (currentPool == "kobradagplns1" || currentPool == "kobradagsolo1" || currentPool == "pugdagpplns1" || currentPool == "pugdagsolo1" || currentPool == "consensuspplns1" || currentPool == "consensussolo1" || currentPool == "hoosatpplns1" || currentPool == "hoosatsolo1" || currentPool == "kaspaclassicpplns1" || currentPool == "kaspaclassicsolo1" || currentPool == "nautiluspplns1" || currentPool == "nautilussolo1" || currentPool == "nexelliapplns1" || currentPool == "nexelliasolo1" || currentPool == "pyrinpplns1" || currentPool == "pyrinsolo1") {
                        var effort = Number(value.effort) * Math.pow(2, 31) * 100;
                    } else {
                        var effort = value.effort * 100;
                    }

                    //$("#poolEffort").html(PoolEffort.toFixed(2) + "&percnt;");


                    var effortClass = "";
                    var ServerFlag = "<img class='serverimg small-server-image' src='img/coin/" + value.source + ".png' />";



                    if (effort >= 500) {
                        effortClass = "effort4";
                    } else if (effort >= 300) {
                        effortClass = "effort3";
                    } else if (effort >= 200) {
                        effortClass = "effort2";
                    } else if (effort >= 100) {
                        effortClass = "effort1";
                    } else {
                        effortClass = "effort0";
                    }

                    var status = value.status;
                    var blockTable = (status === "pending" && value.confirmationProgress === 0) ? newBlockList : pendingBlockList && (status === "pending") ? pendingBlockList : blockList;
                    var timeAgo = getTimeAgo(createDate); // Calculate the time difference

                    blockTable += "<tr>";
                    blockTable += "<td title='" + createDate + "'>" + timeAgo + "</td>";
                    blockTable += "<td>" + value.miner.substring(0, 8) + " &hellip; " + value.miner.substring(value.miner.length - 8) + "</td>";
                    blockTable += "<td><a href='" + value.infoLink + "' target='_blank'>" + Intl.NumberFormat().format(value.blockHeight) + "</a></td>";

                    blockTable += "<td>" + _formatter(value.networkDifficulty, 5, "") + "</td>";
                    if (typeof value.effort !== "undefined") {
                        blockTable += "<td class='" + effortClass + "'>" + effort.toFixed(2) + "%</td>";
                    } else {
                        blockTable += "<td>Calculating...</td>";
                    }
                    // Block object for each block
                    var block = {
                        timeAgo: timeAgo,
                        blockHeight: value.blockHeight,
                        miner: value.miner,
                        networkDifficulty: value.networkDifficulty.toFixed(8),
                        effortClass: effortClass,
                        status: value.status,
                        progressValue: progressValue,
                    };
                    if (status === "pending") {
                        if (value.confirmationProgress === 0) {
                            block.reward = "Waiting...";
                            blockTable += "<td>Waiting...</td>";
                            blockTable += "<td>New Block</td>";
                            newBlockCount++;
                        } else {
                            block.reward = "Waiting...";
                            blockTable += "<td>Waiting...</td>";
                            if (value.type == "uncle") blockTable += "<td>" + "Uncle" + "</td>";
                            else if (status === "orphaned") blockTable += "<td>" + "Orphaned" + "</td>";
                            else blockTable += "<td>" + "Pending" + "</td>";
                            pendingBlockCount++;
                        }
                    } else if (status === "confirmed") {
                        block.reward = Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(value.reward);
                        blockTable += "<td>" + Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(value.reward) + "</td>";
                        blockTable += "<td>" + "Confirmed" + "</td>";
                        confirmedBlockCount++;
                    } else if (status === "orphaned") {
                        block.reward = Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(value.reward);
                        blockTable += "<td>" + Intl.NumberFormat('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(value.reward) + "</td>";
                        blockTable += "<td>" + "Orphaned" + "</td>";
                    } else {
                        blockTable += status;
                    }
                    // Populate minerBlocks based on the miner value
                    if (!minerBlocks[value.miner]) {
                        minerBlocks[value.miner] = [];
                    }
                    minerBlocks[value.miner].push(block);
                    var progressValue = (currentPool.includes("woodcoin")) ? Math.min(Math.round(value.confirmationProgress * 6 * 100), 100) : Math.round(value.confirmationProgress * 100);
                    blockTable += "<td><div class='progress-bar bg-green progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='" + progressValue + "' aria-valuemin='0' aria-valuemax='100' style='width: " + progressValue + "%'><span>" + progressValue + "% Completed</span></div></td>";
                    blockTable += "</tr>";

                    if (status === "pending") {
                        if (value.confirmationProgress === 0) {
                            newBlockList = blockTable;
                        } else {
                            pendingBlockList = blockTable;
                        }
                    } else {
                        blockList = blockTable;
                    }
                });
            } else {
                blockList += '<tr><td colspan="8">No blocks found yet</td></tr>';
            }
            $("#blockList").html(blockList);
            $("#newBlockList").html(newBlockList);
            $("#newBlockCount").text(newBlockCount);
            $("#pendingBlockList").html(pendingBlockList);
            $("#pendingBlockCount").text(pendingBlockCount);
            $("#confirmedBlockCount").text(confirmedBlockCount);
            loadStatsData();
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadBlocksList)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}
// Load PAYMENTS page content
function loadPaymentsPage() {
    return $.ajax(API + "pools/" + currentPool + "/payments?page=0&pageSize=500")
        .done(function(data) {
            var paymentList = "";
            if (data.length > 0) {
                $.each(data, function(index, value) {
                    var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
                    paymentList += '<tr>';
                    paymentList += "<td>" + createDate + "</td>";
                    paymentList += '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + ' &hellip; ' + value.address.substring(value.address.length - 12) + '</td>';
                    paymentList += '<td>' + _formatter(value.amount, 5, '') + '</td>';
                    paymentList += '<td colspan="2"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 16) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 16) + ' </a></td>';
                    paymentList += '</tr>';
                });
            } else {
                paymentList += '<tr><td colspan="4">No payments found yet</td></tr>';
            }
            $("#paymentList").html(paymentList);
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadPaymentsList)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}

// Get stratum URL:port and ping for status
function loadStratumStatus() {
	return $.each(stratumConnectionInfo, function(index,value){
		let stratumUrl = "http" + value
		$.ajax(stratumUrl)
			.done(function(data){
				console.log("Data returned from " + stratumUrl, data)
			})
			.fail(function() {
        $.notify({
            message: "Error: No response from stratum: " + stratumUrl
        }, {
            type: "danger",
            timer: 3000
        });
      });
	});
}

// Load CONNECTION page content
function loadConnectPage() {
    return $.ajax(API + "pools")
        .done(function(data) {
            var connectPoolConfig = "";
            $.each(data.pools, function(index, value) {
                if (currentPool === value.id) {

                    defaultPort = Object.keys(value.ports)[0];
                    NicehashPort = Object.keys(value.ports)[1];
                    coinName = value.coin.name;
                    coinType = value.coin.type.toLowerCase();
                    coinSite = value.coin.website;
                    coinGithub = value.coin.github;
                    coinExplorer = value.coin.explorer;
                    PoolWallet = value.address;
                    algorithm = value.coin.algorithm;
                    var stratum = "";
                    if (value.coin.family === "ethereum") stratum = "stratum2";
                    else stratum = "stratum";

                    // Connect Pool config table
                    connectPoolConfig += "<tr><td>Coin:</td><td>" + coinName + " (" + value.coin.type + ") </td></tr>";
                    //connectPoolConfig += "<tr><td>Coin Family line </td><td>" + value.coin.family + "</td></tr>";
                    connectPoolConfig += "<tr><td>Algorithm</td><td>" + algorithm + "</td></tr>";
                    //connectPoolConfig += '<tr><td>Pool Wallet</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + " &hellip; " + value.address.substring(value.address.length - 12) + "</a></td></tr>";
                    if (typeof coinSite !== "undefined") {
                        connectPoolConfig += '<tr><td>Website</td><td><a href="' + coinSite + '" target="_blank">' + coinSite + "</a></td></tr>";
                    }
                    if (typeof coinGithub !== "undefined") {
                        connectPoolConfig += '<tr><td>Github</td><td><a href="' + coinGithub + '" target="_blank">' + coinGithub + "</a></td></tr>";
                    }
                    if (typeof coinExplorer !== "undefined") {
                        connectPoolConfig += '<tr><td>Explorer</td><td><a href="' + coinExplorer + '" target="_blank">' + coinExplorer + "</a></td></tr>";
                    }
                    connectPoolConfig += '<tr><td>Pool Wallet</td><td><a href="' + value.addressInfoLink + '" target="_blank">' + PoolWallet.substring(0, 12) + " &hellip; " + value.address.substring(value.address.length - 12) + "</a></td></tr>";
                    connectPoolConfig += "<tr><td>Payout Scheme</td><td>" + value.paymentProcessing.payoutScheme + "</td></tr>";
                    connectPoolConfig += "<tr><td>Minimum Payment</td><td>" + value.paymentProcessing.minimumPayment + " " + value.coin.type + "</td></tr>";
                    if (typeof value.paymentProcessing.minimumPaymentToPaymentId !== "undefined") {
                        connectPoolConfig += "<tr><td>Minimum Payout (to Exchange)</td><td>" + value.paymentProcessing.minimumPaymentToPaymentId + "</td></tr>";
                    }
                    connectPoolConfig += "<tr><td>Pool Fee</td><td>" + value.poolFeePercent + "%</td></tr>";
                    /*
			$.each(value.ports, function(port, options) 
				//connectPoolConfig += "<tr><td>stratum+tcp://" + coinType + "." + stratumAddress + ":" + port + "</td><td>";
        {
					connectPoolConfig += "<tr><td>";
					if (options.tls === true && options.tlsAuto === false) { 
						connectPoolConfig += stratum + "+ssl://" + stratumAddress + ":" + port;
					} 
					else if (options.tls === true && options.tlsAuto === true) { 
						connectPoolConfig += stratum +"+tcp://" + stratumAddress + ":" + port;
						connectPoolConfig += "<br>" + stratum+ "+ssl://" + stratumAddress + ":" + port;
					} 
					else 
					{
						connectPoolConfig += "stratum+tcp://" + stratumAddress + ":" + port ;
						//connectPoolConfig += "stratum+tcp://" + stratumAddress + ":" + port;
					}
					connectPoolConfig += "</td><td>";
				//connectPoolConfig += "<tr><td>stratum+tcp://" + stratumAddress + ":" + port + "</td><td>";
					
				if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
					connectPoolConfig += "Difficulty Variable / " + options.varDiff.minDiff + " &harr; ";
					if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
						connectPoolConfig += "&infin; " + " " + "(" + options.name + ")";
						} else {
							connectPoolConfig += options.varDiff.maxDiff ;
						}
					} else {
						connectPoolConfig += "Difficulty Static / " + options.difficulty  + " " + "(" + options.name + ")";
				}
				connectPoolConfig += "</td></tr>";
			});
 
        }
      });*/
                    $.each(value.ports, function(port, options) {
                        stratumAddressPrefix.forEach(function(prefix) {
                            connectPoolConfig += "<tr><td><img src=\"img/flags/" + prefix + ".svg\" width=\"20\" height=\"20\">&nbsp;" + prefix + ": stratum+tcp://" + prefix + "." + stratumAddress + ":" + port + "</td><td>";
                            let poolConnection = prefix + "." + stratumAddress + ":" + port;
                            stratumConnectionInfo.push(poolConnection)
                            if (typeof options.varDiff !== "undefined" && options.varDiff != null) {
                                connectPoolConfig += "StartDiff: " + options.difficulty + " / Min: " + options.varDiff.minDiff + " &harr; Max: ";
                                if (typeof options.varDiff.maxDiff === "undefined" || options.varDiff.maxDiff == null) {
                                    connectPoolConfig += "&infin; " + " " + "(" + options.name + ")";
                                } else {
                                    connectPoolConfig += options.varDiff.maxDiff;
                                }
                            } else {
                                connectPoolConfig += "Difficulty Static / " + options.difficulty + " " + "(" + options.name + ")";
                            }

                            connectPoolConfig += "</td></tr>";
                        });
                    });
                }
            });
            connectPoolConfig += "</tbody>";
            $("#connectPoolConfig").html(connectPoolConfig);


            // Connect Miner config 

            $("#miner-config").html("");
            $("#miner-config").load("poolconfig/" + algorithm + ".html",
                function(response, status, xhr) {
                    if (status == "error" || status == "undefined") {
                        $("#miner-config").load("poolconfig/default.html",
                            function(responseText) {
                                var config = $("#miner-config")
                                    .html()
                                    .replace(/{{ stratumAddress }}/g, stratumAddress + ":" + defaultPort)
                                    .replace(/{{ NiceHashPort }}/g, NicehashPort)
                                    .replace(/{{ stratumNicehash }}/g, stratumAddress)
                                    .replace(/{{ coinName }}/g, coinName)
                                    //.replace(/{{ algorithm }}/g, algorithm);
                                    .replace(/{{ coinSite }}/g, coinSite)
                                    .replace(/{{ coinGithub }}/g, coinGithub)
                                    .replace(/{{ coinExplorer }}/g, coinExplorer)
                                    .replace(/{{ PoolWallet }}/g, PoolWallet)
                                    .replace(/{{ algorithm }}/g, algorithm.toLowerCase());
                                $(this).html(config);
                            }
                        );
                    } else {
                        var config = $("#miner-config")
                            .html()
                            //.replace(/{{ stratumAddress }}/g, coinType + "." + stratumAddress + ":" + defaultPort)
                            .replace(/{{ stratumAddress }}/g, stratumAddress + ":" + defaultPort)
                            .replace(/{{ NiceHashPort }}/g, NicehashPort)
                            .replace(/{{ stratumNicehash }}/g, stratumAddress)
                            .replace(/{{ coinName }}/g, coinName)
                            //.replace(/{{ algorithm }}/g, algorithm);
                            .replace(/{{ coinSite }}/g, coinSite)
                            .replace(/{{ coinGithub }}/g, coinGithub)
                            .replace(/{{ coinExplorer }}/g, coinExplorer)
                            .replace(/{{ PoolWallet }}/g, PoolWallet)
                            .replace(/{{ algorithm }}/g, algorithm.toLowerCase());
                        $(this).html(config);
                    }
                }
            );
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadConnectConfig)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}


// Dashboard - load wallet stats
function loadWallet() {
    console.log('Loading wallet address:', $("#walletAddress").val());
    if ($("#walletAddress").val().length > 0) {
        localStorage.setItem(currentPool + "-walletAddress", $("#walletAddress").val());
    }
    var coin = window.location.hash.split(/[#/?]/)[1];
    var currentPage = window.location.hash.split(/[#/?]/)[2] || "stats";
    window.location.href = "#" + currentPool + "/" + currentPage + "?address=" + $("#walletAddress").val();
}


// General formatter function
function _formatter(value, decimal, unit) {
    if (value === 0) {
        return "0 " + unit;
    } else {
        var si = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
            { value: 1e21, symbol: "Z" },
            { value: 1e24, symbol: "Y" }
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return ((value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + " " + si[i].symbol + unit);
    }
}


// Time convert Local -> UTC
function convertLocalDateToUTCDate(date, toUTC) {
    date = new Date(date);
    //Local time converted to UTC
    var localOffset = date.getTimezoneOffset() * 60000;
    var localTime = date.getTime();
    if (toUTC) {
        date = localTime + localOffset;
    } else {
        date = localTime - localOffset;
    }
    newDate = new Date(date);
    return newDate;
}


// Time convert UTC -> Local
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    var localOffset = date.getTimezoneOffset() / 60;
    var hours = date.getUTCHours();
    newDate.setHours(hours - localOffset);
    return newDate;
}

// Function to calculate the time difference between now and a given date
function getTimeAgo(date) {
    var now = new Date();
    var diff = now.getTime() - date.getTime();
    var seconds = Math.floor(diff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    var months = Math.floor(days / 30);

    if (days >= 30) {
        return months + " month" + (months > 1 ? "s" : "") + " ago";
    } else if (days >= 1 && days <= 30) {
        return days + " day" + (days > 1 ? "s" : "") + " ago";
    } else if (hours >= 1) {
        return hours + " hour" + (hours > 1 ? "s" : "") + " ago";
    } else if (minutes >= 1) {
        return minutes + " mins ago";
    } else if (seconds >= 1) {
        return seconds + " secs ago";
    } else {
        return "Unavailable";
    }
}

// Function to calculate the time difference between now and a given date
function renderTimeAgoBox(date) {
    var textColor = 'white';
    var borderRadius = '.25em';
    var bgColor = '';

    function getTimeAgoAdmin(date) {
        if (!date || isNaN(date.getTime())) {
            return "NEVER";
        }
        var now = new Date();
        var diff = now.getTime() - date.getTime();
        var seconds = Math.floor(diff / 1000);
        if (seconds < 60) {
            return "NOW";
        }
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
        var months = Math.floor(days / 30);
        if (months >= 1) {
            return months + " month" + (months > 1 ? "s" : "");
        } else if (days >= 2) {
            return days + " day" + (days > 1 ? "s" : "");
        } else if (hours >= 48) {
            return "2 days";
        } else if (hours >= 2) {
            return hours + " hours";
        } else if (minutes >= 2) {
            return minutes + " min" + (minutes > 1 ? "s" : "");
        } else {
            return "NOW";
        }
    }
    var timeAgo = getTimeAgoAdmin(date);
    if (timeAgo === "NEVER" || timeAgo === "NOW") {
        bgColor = (timeAgo === "NEVER") ? '#666666' : '#00c000';
    } else if (timeAgo.includes("month")) {
        bgColor = '#d1941f'; // Orange for months
    } else if (timeAgo.includes("day")) {
        bgColor = '#c0c000'; // Yellow for days
    } else if (timeAgo.includes("hour")) {
        bgColor = '#008000'; // Dark green for hours
    } else if (timeAgo.includes("min")) {
        bgColor = '#00c000'; // Bright green for minutes
    }
    return "<div class='d-flex align-items-center justify-content-center' style='background-color:" + bgColor + "; color: " + textColor + "; border-radius: " + borderRadius + "; width: 100%; padding: 2px; font-size: 75%; font-weight: 700; text-align: center; height: 20px;'>" + timeAgo + "</div>";
}

// String Convert -> Seconds
function readableSeconds(t) {
    var seconds = Math.floor(t % 3600 % 60);
    var minutes = Math.floor(t % 3600 / 60);
    var hours = Math.floor(t % 86400 / 3600);
    var days = Math.floor(t % 604800 / 86400);
    var weeks = Math.floor(t % 2629799.8272 / 604800);
    var months = Math.floor(t % 31557597.9264 / 2629799.8272);
    var years = Math.floor(t / 31557597.9264);

    var sYears = years > 0 ? years + ((years == 1) ? "y" : "y") : "";
    var sMonths = months > 0 ? ((years > 0) ? " " : "") + months + ((months == 1) ? "mo" : "mo") : "";
    var sWeeks = weeks > 0 ? ((years > 0 || months > 0) ? " " : "") + weeks + ((weeks == 1) ? "w" : "w") : "";
    var sDays = days > 0 ? ((years > 0 || months > 0 || weeks > 0) ? " " : "") + days + ((days == 1) ? "d" : "d") : "";
    var sHours = hours > 0 ? ((years > 0 || months > 0 || weeks > 0 || days > 0) ? " " : "") + hours + (hours == 1 ? "h" : "h") : "";
    var sMinutes = minutes > 0 ? ((years > 0 || months > 0 || weeks > 0 || days > 0 || hours > 0) ? " " : "") + minutes + (minutes == 1 ? "m" : "m") : "";
    var sSeconds = seconds > 0 ? ((years > 0 || months > 0 || weeks > 0 || days > 0 || hours > 0 || minutes > 0) ? " " : "") + seconds + (seconds == 1 ? "s" : "s") : ((years < 1 && months < 1 && weeks < 1 && days < 1 && hours < 1 && minutes < 1) ? " Few milliseconds" : "");
    if (seconds > 0) return sYears + sMonths + sWeeks + sDays + sHours + sMinutes + sSeconds;
    else return "&#8734;";
}

// Scroll to top off page
function scrollPageTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    var elmnt = document.getElementById("page-scroll-top");
    elmnt.scrollIntoView();
}


// Check if file exits
function doesFileExist(urlToFile) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();

    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}


// STATS page data
async function loadStatsData() {
    console.log('Loading stats data...');
    try {
        const data = await $.ajax(API + "pools");
        const value = data.pools.find(pool => currentPool === pool.id);
        if (!value) {
            throw new Error("Pool not found");
        }

        var getcoin_price = 0;

        var totalBlocks = value.totalBlocks;
        var poolEffort = value.poolEffort * 100;
        $("#blockchainHeight").text(value.networkStats.blockHeight.toLocaleString());
        $("#poolBlocks").text(totalBlocks.toLocaleString());
        $("#connectedPeers").text(value.networkStats.connectedPeers);
        $("#minimumPayment").html(`${value.paymentProcessing.minimumPayment.toLocaleString()} ${value.coin.symbol}<br>(${value.paymentProcessing.payoutScheme})`);
        $("#totalPaid").html(value.totalPaid.toLocaleString() + " " + value.coin.symbol);
        $("#poolFeePercent").text(`${value.poolFeePercent} %`);
        $("#poolHashRate").text(_formatter(value.poolStats.poolHashrate, 2, "H/s"));
        $("#poolMiners").text(`${value.poolStats.connectedMiners} Miner(s)`);
        $("#networkHashRate").text(_formatter(value.networkStats.networkHashrate, 2, "H/s"));
        $("#networkDifficulty").text(_formatter(value.networkStats.networkDifficulty, 5, ""));
        const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=" + totalBlocks);
        let pendingCount = 0;
        for (let i = 0; i < blocksResponse.length; i++) {
            const currentBlock = blocksResponse[i];
            if (currentBlock.status === "pending") {
                pendingCount++;
            }
        }
        let confirmedCount = 0;
        for (let i = 0; i < blocksResponse.length; i++) {
            const currentBlock = blocksResponse[i];
            if (currentBlock.status === "confirmed") {
                confirmedCount++;
            }
        }
        //console.log("Total Pending Blocks:", pendingCount);

        let reward = 0;
        for (let i = 0; i < blocksResponse.length; i++) {
            const currentBlock = blocksResponse[i];
            if (currentBlock.status === "confirmed") {
                reward = currentBlock.reward;
                break;
            }
        }

        $("#poolEffort").html(poolEffort.toFixed(2) + " %");

        var networkHashRate = value.networkStats.networkHashrate;
        var poolHashRate = value.poolStats.poolHashrate;
        if (confirmedCount > 0) //blocksResponse.length
        {
            var ancientBlock = blocksResponse[blocksResponse.length - 1];
            var recentBlock = blocksResponse[0];
            var MostRecentBlockTime = recentBlock.created;
            var MostRecentBlockHeight = recentBlock.blockHeight;
            var MostAncientBlockTime = ancientBlock.created;
            var MostAncientBlockHeight = ancientBlock.blockHeight;
            var MostRecentBlockTimeInSeconds = new Date(MostRecentBlockTime).getTime() / 1000;
            var MostAncientBlockTimeInSeconds = new Date(MostAncientBlockTime).getTime() / 1000;
            var blockTime = (MostRecentBlockTimeInSeconds - MostAncientBlockTimeInSeconds) / (MostRecentBlockHeight - MostAncientBlockHeight);
            var ttf_blocks = (networkHashRate / poolHashRate) * blockTime;
        } else {
            var blockTime = value.blockRefreshInterval;
            var ttf_blocks = (networkHashRate / poolHashRate) * blockTime;
        }
        $("#text_TTFBlocks").html(readableSeconds(ttf_blocks));
        $("#text_BlockReward").text(reward.toLocaleString() + " (" + value.coin.symbol + ")");
        $("#text_BlocksPending").text(pendingCount.toLocaleString());
        $("#poolBlocks").text(confirmedCount.toLocaleString());
        $("#blockreward").text(reward.toLocaleString() + " (" + value.coin.symbol + ")");

        if (value.coin.symbol == "LOG") {
            var coinname = value.coin.name.toLowerCase();
            const CoingeckoResponse = await $.ajax("https://api.coingecko.com/api/v3/simple/price?ids=" + coinname + "&vs_currencies=usd");
            var getcoin_price = CoingeckoResponse[coinname]['usd'];
        } else if (value.coin.symbol == "VRSC") {
            const CoingeckoResponse = await $.ajax("https://api.coingecko.com/api/v3/simple/price?ids=verus-coin&vs_currencies=usd");
            var getcoin_price = CoingeckoResponse['verus-coin']['usd'];
        } else if (value.coin.symbol == "MBC" || value.coin.symbol == "GEC" || value.coin.symbol == "ETX" || value.coin.symbol == "ISO") {
            const bitxonexResponse = await $.ajax("https://www.bitxonex.com/api/v2/trade/public/markets/" + value.coin.symbol.toLowerCase() + "usdt/tickers");
            var getcoin_price = bitxonexResponse.ticker.last;
        } else if (value.coin.symbol == "REDE") {
            const XeggexResponse = await $.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/REDEV2%2FUSDT");
            var getcoin_price = XeggexResponse.lastPrice;
        } else {
            $.ajax("https://api.xeggex.com/api/v2/market/getbysymbol/" + value.coin.symbol + "%2FUSDT").done(function(data) {
                var getcoin_price = data['lastPrice'];
                $("#text_Price").html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0 }).format(getcoin_price));
                $("#text_BlockValue").html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(getcoin_price * reward));
            }).fail(function() {
                var getcoin_price = 0;
                $("#text_Price").html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0 }).format(getcoin_price));
                $("#text_BlockValue").html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(getcoin_price * reward));
            });
        }
        $("#text_Price").html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 9, minimumFractionDigits: 0 }).format(getcoin_price));
        $("#text_BlockValue").html(Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 0 }).format(getcoin_price * reward));
        console.log(value.coin.symbol, 'price: ', getcoin_price);

        //		loadWorkerTTFBlocks();
    } catch (error) {
        console.error(error);
    }
}

// STATS page charts
function loadStatsChart() {
    return $.ajax(API + "pools/" + currentPool + "/performance")
        .done(function(data) {
            labels = [];

            poolHashRate = [];
            networkHashRate = [];
            networkDifficulty = [];
            connectedMiners = [];
            connectedWorkers = [];

            $.each(data.stats, function(index, value) {
                if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
                    var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
                    labels.push(createDate.getHours() + ":00");
                } else {
                    labels.push("");
                }
                poolHashRate.push(value.poolHashrate);
                networkHashRate.push(value.networkHashrate);
                networkDifficulty.push(value.networkDifficulty);
                connectedMiners.push(value.connectedMiners);
                connectedWorkers.push(value.connectedWorkers);
            });

            var dataPoolHash = { labels: labels, series: [poolHashRate] };
            var dataNetworkHash = { labels: labels, series: [networkHashRate] };
            var dataNetworkDifficulty = { labels: labels, series: [networkDifficulty] };
            var dataMiners = { labels: labels, series: [connectedMiners, connectedWorkers] };

            var options = {
                height: "200px",
                showArea: false,
                seriesBarDistance: 1,
                // low:Math.min.apply(null,networkHashRate)/1.1,
                axisX: {
                    showGrid: false
                },
                axisY: {
                    offset: 47,
                    scale: "logcc",
                    labelInterpolationFnc: function(value) {
                        return _formatter(value, 1, "");
                    }
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2
                })
            };

            var responsiveOptions = [
                [
                    "screen and (max-width: 320px)",
                    {
                        axisX: {
                            labelInterpolationFnc: function(value) {
                                return value[1];
                            }
                        }
                    }
                ]
            ];
            Chartist.Line("#chartStatsHashRate", dataNetworkHash, options, responsiveOptions);
            Chartist.Line("#chartStatsHashRatePool", dataPoolHash, options, responsiveOptions);
            Chartist.Line("#chartStatsDiff", dataNetworkDifficulty, options, responsiveOptions);
            Chartist.Line("#chartStatsMiners", dataMiners, options, responsiveOptions);

        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadStatsChart)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}


// DASHBOARD page data
function loadUserBalanceData(walletAddress) {
    console.log('Loading user balance data...');
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/payments")
        .done(function(data) {
            if (data.length > 0) {
                var datetime = data[0].created;
                var date = datetime.split("T")[0];
                var time = datetime.split("T")[1].split(".")[0];
                var currentTime = new Date();
                var createdTime = new Date(datetime);
                var timeDifference = currentTime - createdTime;
                $("#lastPayment").html(formatMilliseconds(timeDifference) + " ago" + "<br>" + "Amount: " + _formatter(data[0].amount, 5, ""));
            } else {
                $("#lastPayment").html("No payments received");
            }
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(UserBalanceData)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}

// DASHBOARD page paymentThreshold
function loadMinerPaymentThreshold(walletAddress) {
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/settings")
        .done(function(data) {
            if (data) {
                $("#paymentThreshold").text(_formatter(data.paymentThreshold, 0, ""));

            } else {
                $("#paymentThreshold").text("Not set");
            }
        })
        .fail(function() {
            $("#paymentThreshold").text("Not set");
            $.notify({
                message: "Error: No response from API.<br>(loadMinerPaymentThreshold)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}
// DASHBOARD page setMinerPaymentThreshold
// Function to open the modal
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

// Function to handle form submission
async function handleSubmit() {
    // Get the values from the modal inputs
    const ipAddress = document.getElementById('ipAddressModal').value;
    const thresholdValue = document.getElementById('thresholdValueModal').value;
    // Get the Wallet address from the URL
    var walletAddress = ""
    var walletQueryString = window.location.hash.split(/[#/?]/)[3];
    if (walletQueryString) {
        walletAddress = window.location.hash.split(/[#/?]/)[3].replace("address=", "");
    }

    try {
        // Check if walletAddress is defined
        if (!walletAddress) {
            // Display a specific error message if walletAddress is not defined
            alert('Please load your wallet address in the dashboard first.');
            return; // Exit the function early
        }

        // Check if there is at least one active worker
        const workerResponse = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
        var workerList = "";
        if (!workerResponse.performance || !workerResponse.performance.workers || workerResponse.performance.workers.length === 0) {
            // Display a specific error message if there are no workers
            alert('You need at least one active worker to change your payment threshold.');
            return; // Exit the function early
        }

        // Call the function to update settings
        const response = await setMinerPaymentThreshold(walletAddress, thresholdValue, ipAddress);

        // Display the response in a popup
        alert(response.message); // Assuming the response contains a message field
        // Reload the page
        location.reload();
    } catch (error) {
        // Display error in case of failure
        alert('Error updating settings: ' + error.message);
    }

    // Close the modal
    closeModal();

    // Optional: Reset the modal inputs
    document.getElementById('ipAddressModal').value = '';
    document.getElementById('thresholdValueModal').value = '';
}

// Function to set the custom treshold
async function setMinerPaymentThreshold(walletAddress, thresholdValueModal, ipAddressModal) {

    const apiUrl = API + "pools/" + currentPool + "/miners/" + walletAddress + "/settings";

    const requestBody = {
        settings: {
            PaymentThreshold: thresholdValueModal
        },
        ipAddress: ipAddressModal
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = {
            message: '' // Initialize message field
        };

        if (response.ok) {
            responseData.message = 'Settings updated successfully.';
        } else {
            // If response is not okay, attempt to parse error message from response body
            try {
                const errorData = await response.json();
                responseData.message = errorData.message || 'Unknown error occurred.';
            } catch (error) {
                responseData.message = 'Bad IP address';
            }
        }
        return responseData;
    } catch (error) {
        console.error('Error updating miner settings:', error);
        throw error;
    }
}

// DASHBOARD page Daily revenue
function loadMinerDailyEarnings(walletAddress) {
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/earnings/daily?page=0&pageSize=10")
        .done(function(data) {
            var dailyEarnings = "";
            if (data.length > 0) {
                $.each(data, function(index, value) {
                    var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
                    var timeAgo = getTimeAgo(createDate); // Calculate the time difference
                    dailyEarnings += '<tr>';
                    dailyEarnings += "<td>" + value.date + "</td>";
                    //DailyEarnings +=   '<td><a href="' + value.addressInfoLink + '" target="_blank">' + value.address.substring(0, 12) + ' &hellip; ' + value.address.substring(value.address.length - 12) + '</td>';
                    dailyEarnings += '<td>' + _formatter(value.amount, 5, '') + '</td>';
                    //DailyEarnings +=   '<td colspan="2"><a href="' + value.transactionInfoLink + '" target="_blank">' + value.transactionConfirmationData.substring(0, 16) + ' &hellip; ' + value.transactionConfirmationData.substring(value.transactionConfirmationData.length - 16) + ' </a></td>';
                    dailyEarnings += '</tr>';
                });
            } else {
                dailyEarnings += '<tr><td colspan="4">No earnings found yet</td></tr>';
            }
            $("#dailyEarnings").html(dailyEarnings);
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadMinerDailyEarnings)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}
/*
// Worker TTF Blocks
async function loadWorkerTTFBlocks(walletAddress) {
	console.log("Loading worker TTF Blocks");
	try 
	{
		const response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress);
		var workerHashRate = 0;
		var workerSharesPerSecond = 0;
		var pendingShares = response.pendingShares
		if (response.performance) 
		{
			$.each(response.performance.workers, function (index, value) 
			{
				workerHashRate += value.hashrate;
				workerSharesPerSecond += value.sharesPerSecond
			});
			// console.log("Worker Shares Per Second: " + workerSharesPerSecond);

			const minersResponse = await $.ajax(API + "pools/" + currentPool + "/miners?page=0&pagesize=50");
			const sharesPerSecond = minersResponse.map(miner => miner.sharesPerSecond);
			var totalPoolSharesPerSecond = sharesPerSecond.reduce((sum, value) => sum + value, 0);
			var minersShareRatio = workerSharesPerSecond / totalPoolSharesPerSecond;
			// console.log("Miners Share Ratio: " + minersShareRatio);
			// console.log("Total Pool Shares Per Second: " + totalPoolSharesPerSecond);
			// console.log("Miners Shares Per Second: " + workerSharesPerSecond);

			const poolsResponse = await $.ajax(API + "pools");
			var blockHeights = [];
			var blockTimes = [];
			$.each(poolsResponse.pools, async function (index, value) 
			{
				if (currentPool === value.id) 
				{
					var networkHashRate = value.networkStats.networkHashrate;
					var poolHashRate = value.poolStats.poolHashrate;
					var poolFeePercentage = value.poolFeePercent;
					var currentBlockheight = value.networkStats.blockHeight;
					var currentBlockheightTime = value.networkStats.lastNetworkBlockTime;
					blockHeights.push(currentBlockheight);
					blockTimes.push(currentBlockheightTime);
					if (blockHeights.length > 1000) 
					{
						blockHeights.shift();
						blockTimes.shift();
					}
					var totalTime = 0;
					for (var i = 1; i < blockHeights.length; i++) 
					{
						var timeDifference = blockTimes[i] - blockTimes[i - 1];
						totalTime += timeDifference;
					}
					var averageTime = totalTime / (blockHeights.length - 1);
					// console.log("Average block time: " + averageTime + " ms");
					
					const blocksResponse = await $.ajax(API + "pools/" + currentPool + "/blocks?page=0&pageSize=500");
					let pendingCount = 0;
					for (let i = 0; i < blocksResponse.length; i++) 
					{
						const currentBlock = blocksResponse[i];
						if (currentBlock.status === "pending") 
						{
							pendingCount++;
						}
					}
					let confirmedCount = 0;
					for (let i = 0; i < blocksResponse.length; i++) 
					{
						const currentBlock = blocksResponse[i];
						if (currentBlock.status === "confirmed") 
						{
							confirmedCount++;
						}
					}
					// console.log("Total Pending Blocks:", pendingCount);

					let reward = 0;
					for (let i = 0; i < blocksResponse.length; i++) 
					{
						const currentBlock = blocksResponse[i];
						if (currentBlock.status === "confirmed") 
						{
							reward = currentBlock.reward;
							break;
						}
					}

					const blocks2Response = await $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress+ "/blocks?page=0&pageSize=5000");
					var blocksConfirmedByMiner = 0;
					for (let i = 0; i < blocks2Response.length; i++) 
					{
						const currentBlock = blocks2Response[i];
						if (currentBlock.status === "confirmed") 
						{
							blocksConfirmedByMiner++;
						}
					}
					var blocksPendingByMiner = 0;
					for (let i = 0; i < blocks2Response.length; i++) 
					{
						const currentBlock = blocks2Response[i];
						if (currentBlock.status === "pending") 
						{
							blocksPendingByMiner++;
						}
					}
					var totalCoinsPending = (pendingCount * reward)
					var poolFeePercentage = (poolFeePercentage / 100);
					var workersPoolSharePercent = (workerHashRate / poolHashRate);
					var workersNetSharePercent = (workerHashRate / networkHashRate);
					var immatureWorkerBalance = ((totalCoinsPending * poolFeePercentage) * minersShareRatio) * 100;
					var immatureWorkerBalance2 = ((totalCoinsPending * poolFeePercentage) * workersPoolSharePercent) * 100;
					if (blocksResponse.length > 0)
					{
						var ancientBlock = blocksResponse[blocksResponse.length - 1];
						var recentBlock = blocksResponse[0];
						var MostRecentBlockTime = recentBlock.created;
						var MostRecentBlockHeight = recentBlock.blockHeight;
						var MostAncientBlockTime = ancientBlock.created;
						var MostAncientBlockHeight = ancientBlock.blockHeight;
						var MostRecentBlockTimeInSeconds = new Date(MostRecentBlockTime).getTime() / 1000;
						var MostAncientBlockTimeInSeconds = new Date(MostAncientBlockTime).getTime() / 1000;
						var blockTime = (MostRecentBlockTimeInSeconds - MostAncientBlockTimeInSeconds) / (MostRecentBlockHeight - MostAncientBlockHeight);
						var ttf_blocks = (networkHashRate / workerHashRate) * blockTime;
						var blocksPer24Hrs = (86400 / ttf_blocks);
						var MinersCoin = (reward) * (86400 / blockTime) * (workerHashRate / networkHashRate);
						$("#MinersCoins").html("Coins: " + MinersCoin.toLocaleString() + "<br>" + "Blocks: " + blocksPer24Hrs.toFixed(2));
						$("#MinersShare").html("Pool Share: " + _formatter((workersPoolSharePercent) * 100, 2, "%") + "<br>" + "Net. Share: " + _formatter((workersNetSharePercent) * 100, 2, "%"));
						$("#BlocksByMiner").html("Pending: " +  blocksPendingByMiner + "<br>" + "Confirmed: " + blocksConfirmedByMiner);
						$("#TTF_Blocks").html(readableSeconds(ttf_blocks));
						$("#Blocktime").html(formatTime(blockTime));
						$("#pendingBalance").html(("Shares: " + _formatter(pendingShares, 2, "") + "<br>" + "Coins: " + Intl.NumberFormat().format(immatureWorkerBalance2)));
						$("#ConfirmedBlocks").text(confirmedCount.toLocaleString());
					}
					else
					{
						var blockTime = value.blockRefreshInterval;
						var ttf_blocks = (networkHashRate / workerHashRate) * blockTime;
						var blocksPer24Hrs = (86400 / ttf_blocks);
						var MinersCoin = (reward) * (86400 / blockTime) * (workerHashRate / networkHashRate);
						$("#MinersCoins").html("Coins: " + MinersCoin.toLocaleString() + "<br>" + "Blocks: " + blocksPer24Hrs.toFixed(2));
						$("#MinersShare").html("Pool Share: " + _formatter((workersPoolSharePercent) * 100, 2, "%") + "<br>" + "Net. Share: " + _formatter((workersNetSharePercent) * 100, 2, "%"));
						$("#BlocksByMiner").html("Pending: " +  blocksPendingByMiner + "<br>" + "Confirmed: " + blocksConfirmedByMiner);
						$("#TTF_Blocks").html(readableSeconds(ttf_blocks));
						$("#Blocktime").html(formatTime(blockTime));
						$("#pendingBalance").html(("Shares: " + _formatter(pendingShares, 2, "") + "<br>" + "Coins: " + Intl.NumberFormat().format(immatureWorkerBalance2)));
						$("#ConfirmedBlocks").text(confirmedCount.toLocaleString());
					}
					var minimumPayment = value.paymentProcessing.minimumPayment.toLocaleString();
					$.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/settings").done(function(data){
						var paymentThreshold = data['paymentThreshold'];
						$("#minPayment").html(paymentThreshold + " " + "(" + value.coin.type + ")" + "<br>" + "(" + value.paymentProcessing.payoutScheme + ")");
					})
					.fail(function() 
					{
						$("#minPayment").html(minimumPayment + " " + "(" + value.coin.type + ")" + "<br>" + "(" + value.paymentProcessing.payoutScheme + ")");
					});
				}
			});
		}
	} catch (error) {
		console.error(error);
	}
}
*/
// Load Dashboard page data
function loadDashboardData(walletAddress) {
    console.log('Loading dashboard data...');
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
        .done(function(data) {
            $("#pendingShares").text("Shares: " + _formatter(data.pendingShares, 3, ""));
            var workerHashRate = 0;
            // using shares to calculate estimate
            // Step 1: init sharesPerSecond
            var sharesPerSecond = 0
            var bestWorker = null;
            if (data.performance) {
                $.each(data.performance.workers, function(index, value) {
                    workerHashRate += value.hashrate;
                    if (!bestWorker || value.hashrate > bestWorker.hashrate) {
                        bestWorker = { name: index, hashrate: value.hashrate };
                    }
                    //Step 2: combine shares/sec for all workers
                    sharesPerSecond += value.sharesPerSecond
                });
            }

            var seconds_in_24hours = (60 * 60 * 24) //seconds in a day
            // step 3: extrapolate out shares/second to coins/day
            var worker_24h_estimate = sharesPerSecond * seconds_in_24hours
            $("#minerHashRate").text(_formatter(workerHashRate, 3, "H/s"));
            $("#minerReward").text(_formatter(worker_24h_estimate, 5, ""));
            $("#pendingBalance").text(_formatter(data.pendingBalance, 2, ""));
            $("#paidBalance").html("24hr Paid: " + _formatter(data.todayPaid, 2, "") + "<br>" + "Lifetime Paid: " + _formatter(data.pendingBalance + data.totalPaid, 2, ""));
            //$("#paidBalance").html(_formatter(data.todayPaid, 5, ""));
            $("#lifetimeBalance").text(_formatter(data.pendingBalance + data.totalPaid, 2, ""));
            if (bestWorker && bestWorker.name) {
                $("#BestminerHashRate").text(bestWorker.name + ": " + _formatter(bestWorker.hashrate, 2, "H/s"));
            } else {
                $("#BestminerHashRate").text("N/A");
            }
            if (data.totalPaid === 0) {
                $("#lastPaymentLink").html("No payments received");
            } else {
                $("#lastPaymentLink").html("Explorer: <a href='" + data.lastPaymentLink + "' target='_blank'>" + "Click Here" + "</a>");
            }
            loadHomePage();
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadDashboardData)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}


// DASHBOARD page Miner table
function loadDashboardWorkerList(walletAddress) {
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress)
        .done(function(data) {
            var workerList = "";
            if (data.performance) {
                var workerCount = 0;
                $.each(data.performance.workers, function(index, value) {
                    workerCount++;
                    workerList += "<tr>";
                    workerList += "<td>" + workerCount + "</td>";
                    if (index.length === 0) {
                        workerList += "<td>Unnamed</td>";
                    } else {
                        workerList += "<td>" + index + "</td>";
                    }
                    workerList += "<td>" + _formatter(value.hashrate, 5, "H/s") + "</td>";
                    workerList +=
                        "<td>" + _formatter(value.sharesPerSecond, 5, "S/s") + "</td>";
                    workerList += "</tr>";
                });
            } else {
                workerList += '<tr><td colspan="4">None</td></tr>';
            }
            $("#workerCount").text(workerCount);
            $("#workerList").html(workerList);
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadDashboardWorkerList)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}


// DASHBOARD page chart
function loadDashboardChart(walletAddress) {
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/performance")
        .done(function(data) {

            labels = [];
            minerHashRate = [];

            $.each(data, function(index, value) {
                if (labels.length === 0 || (labels.length + 1) % 4 === 1) {
                    var createDate = convertUTCDateToLocalDate(
                        new Date(value.created),
                        false
                    );
                    labels.push(createDate.getHours() + ":00");
                } else {
                    labels.push("");
                }
                var workerHashRate = 0;
                $.each(value.workers, function(index2, value2) { workerHashRate += value2.hashrate; });
                minerHashRate.push(workerHashRate);
            });
            var data = { labels: labels, series: [minerHashRate] };
            var options = {
                height: "200px",
                showArea: true,
                seriesBarDistance: 1,
                axisX: {
                    showGrid: false
                },
                axisY: {
                    offset: 47,
                    labelInterpolationFnc: function(value) {
                        return _formatter(value, 1, "");
                    }
                },
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2
                })
            };
            var responsiveOptions = [
                [
                    "screen and (max-width: 320px)",
                    {
                        axisX: {
                            labelInterpolationFnc: function(value) {
                                return value[0];
                            }
                        }
                    }
                ]
            ];
            Chartist.Line("#chartDashboardHashRate", data, options, responsiveOptions);

        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadDashboardChart)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}

// DASHBOARD page miner BLOCKS
function loadDashboardBlocksPage(walletAddress) {
    //console.log("loadBlocksPage");
    return $.ajax(API + "pools/" + currentPool + "/miners/" + walletAddress + "/blocks?page=0&pageSize=10")

        .done(function(data) {
            var blockList = "";
            // Reset minerBlocks before populating again
            if (data.length > 0) {
                var blockTable = "";
                $.each(data, function(index, value) {
                    var createDate = convertUTCDateToLocalDate(new Date(value.created), false);
                    // Alephium (family)
                    if (currentPool == "alephium") {
                        effort = Number(value.effort) * Math.pow(2, 30) * 100;
                        // Bitcoin (family)
                    } else if (currentPool == "bitcoin") {
                        // Vertcoin (coin)
                        if (currentPool == "Vertcoin") {
                            effort = (Number(value.effort) / 256) * 100;
                            // VishAI (coin)
                        } else if (currentPool == "Vishai") {
                            effort = (Number(value.effort) / 65536) * 100;
                        } else {
                            effort = Number(value.effort) * 100;
                        }
                        // Kaspa (family)
                    } else if (currentPool == "kobradagplns1" || currentPool == "kobradagsolo1" || currentPool == "pugdagpplns1" || currentPool == "pugdagsolo1" || currentPool == "consensuspplns1" || currentPool == "consensussolo1" || currentPool == "hoosatpplns1" || currentPool == "hoosatsolo1" || currentPool == "kaspaclassicpplns1" || currentPool == "kaspaclassicsolo1" || currentPool == "nautiluspplns1" || currentPool == "nautilussolo1" || currentPool == "nexelliapplns1" || currentPool == "nexelliasolo1" || currentPool == "pyrinpplns1" || currentPool == "pyrinsolo1") {
                        var effort = Number(value.effort) * Math.pow(2, 31) * 100;
                    } else {
                        var effort = value.effort * 100;
                    }

                    //$("#poolEffort").html(PoolEffort.toFixed(2) + "&percnt;");
                    var effortClass = "";

                    if (effort >= 500) {
                        effortClass = "effort4";
                    } else if (effort >= 300) {
                        effortClass = "effort3";
                    } else if (effort >= 200) {
                        effortClass = "effort2";
                    } else if (effort >= 100) {
                        effortClass = "effort1";
                    } else {
                        effortClass = "effort0";
                    }


                    var timeAgo = getTimeAgo(createDate); // Calculate the time difference

                    blockTable += "<tr>";
                    blockTable += "<td title='" + createDate + "'>" + timeAgo + "</td>";
                    //blockTable += "<td>" + value.miner.substring(0, 8) + " &hellip; " + value.miner.substring(value.miner.length - 8) + "</td>";
                    blockTable += "<td><a href='" + value.infoLink + "' target='_blank'>" + Intl.NumberFormat().format(value.blockHeight) + "</a></td>";

                    blockTable += "<td>" + _formatter(value.networkDifficulty, 5, "") + "</td>";
                    if (typeof value.effort !== "undefined") {
                        blockTable += "<td class='" + effortClass + "'>" + effort.toFixed(2) + "%</td>";
                    } else {
                        blockTable += "<td>Calculating...</td>";
                    }
                    blockTable += "<td>" + _formatter(value.reward, 5, "") + "</td>";
                    blockTable += "<td>" + value.status + "</td>";
                    var progressValue = (currentPool.includes("woodcoin")) ? Math.min(Math.round(value.confirmationProgress * 6 * 100), 100) : Math.round(value.confirmationProgress * 100);
                    blockTable += "<td><div class='progress-bar bg-green progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='" + progressValue + "' aria-valuemin='0' aria-valuemax='100' style='width: " + progressValue + "%'><span>" + progressValue + "% Completed</span></div></td>";
                    blockTable += "</tr>";

                    blockList = blockTable;
                });
            } else {
                blockList += '<tr><td colspan="8">No blocks found yet</td></tr>';
            }
            $("#minerBlockList").html(blockList);
            loadStatsData();
        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadBlocksList)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}



// Generate Coin based sidebar
function loadNavigation() {
    return $.ajax(API + "pools")
        .done(function(data) {
            var coinLogo = "";
            var coinName = "";
            var poolList = "<ul class='navbar-nav '>";
            $.each(data.pools, function(index, value) {
                poolList += "<li class='nav-item'>";
                poolList += "  <a href='#" + value.id.toLowerCase() + "' class='nav-link coin-header" + (currentPool == value.id.toLowerCase() ? " coin-header-active" : "") + "'>"
                poolList += "  <img  src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' /> " + value.coin.type;
                poolList += "  </a>";
                poolList += "</li>";
                if (currentPool === value.id) {
                    coinLogo = "<img style='width:40px' src='img/coin/icon/" + value.coin.type.toLowerCase() + ".png' />";
                    coinName = value.coin.name;
                    if (typeof coinName === "undefined" || coinName === null) {
                        coinName = value.coin.type;
                    }
                }
            });
            poolList += "</ul>";

            if (poolList.length > 0) {
                $(".coin-list-header").html(poolList);
            }

            var sidebarList = "";
            const sidebarTemplate = $(".sidebar-template").html();
            sidebarList += sidebarTemplate
                .replace(/{{ coinId }}/g, currentPool)
                .replace(/{{ coinLogo }}/g, coinLogo)
                .replace(/{{ coinName }}/g, coinName)
            $(".sidebar-wrapper").html(sidebarList);

            $("a.link").each(function() {
                if (localStorage[currentPool + "-walletAddress"] && this.href.indexOf("/dashboard") > 0) {
                    this.href = "#" + currentPool + "/dashboard?address=" + localStorage[currentPool + "-walletAddress"];
                }
            });

        })
        .fail(function() {
            $.notify({
                message: "Error: No response from API.<br>(loadNavigation)"
            }, {
                type: "danger",
                timer: 3000
            });
        });
}
