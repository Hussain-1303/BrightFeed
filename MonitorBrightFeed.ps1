<#
.SYNOPSIS
    Performance Monitoring Script for BrightFeed

.DESCRIPTION
    This script monitors key performance metrics for the BrightFeed application:
      - CPU Usage
      - Memory Consumption
      - Network Activity

    It performs the following actions:
      1. Collects baseline metrics for the first 5 minutes.
      2. Logs performance data (timestamped) to a report file.
      3. Checks the metrics against defined thresholds and logs alerts if thresholds are exceeded.
      4. (Optional) Can be extended to send email alerts.

    **Assumptions:**
      - The BrightFeed app is running (npm start, WebScrapingScript.py, and server.py are active).
      - Docker is not used for this project.
      
.NOTES
    Customize threshold values, log file locations, and alert configurations as necessary.
#>

# ------------------------------
# Configuration
# ------------------------------

# Define acceptable thresholds for performance metrics
$cpuThreshold = 70.0           # CPU usage percentage threshold
$memoryThreshold = 80.0        # Memory usage percentage threshold
$networkThreshold = 10000000   # Network usage threshold in Bytes/sec (adjust as necessary)

# Define log file paths (ensure the folder exists or create it)
$logDirectory = ".\perflogs"
if (-not (Test-Path $logDirectory)) {
    New-Item -Path $logDirectory -ItemType Directory | Out-Null
}
$logFile = "$logDirectory\performance_report.log"
$alertLog = "$logDirectory\performance_alerts.log"
$baselineFile = "$logDirectory\baseline_metrics.csv"

# ------------------------------
# Baseline Collection Setup
# ------------------------------

# Collect baseline metrics for the first 5 iterations (assuming a 60-second interval per iteration)
$baselineCpu = @()
$baselineMemory = @()
$baselineNetwork = @()
$baselineIterations = 5  

# ------------------------------
# Functions
# ------------------------------

# Function to write a log entry with a timestamp
function Write-Log {
    param (
        [string]$message,
        [string]$filePath
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $entry = "$timestamp - $message"
    Add-Content -Path $filePath -Value $entry
}

# Function to send an alert (currently logs the alert; can be extended to email notifications)
function Send-Alert {
    param (
        [string]$alertMessage
    )
    Write-Log -message $alertMessage -filePath $alertLog
    # Optional: Configure email alerts by uncommenting and adjusting the following:
    # Send-MailMessage -From "alert@brightfeed.com" -To "team@brightfeed.com" `
    #   -Subject "BrightFeed Performance Alert" -Body $alertMessage -SmtpServer "smtp.brightfeed.com"
}

# Function to retrieve current performance metrics
function Get-PerformanceMetrics {
    # Retrieve total CPU usage
    $cpuCounter = Get-Counter '\Processor(_Total)\% Processor Time'
    $cpuUsage = [math]::Round($cpuCounter.CounterSamples[0].CookedValue, 2)

    # Retrieve memory usage (percentage of committed bytes in use)
    $memCounter = Get-Counter '\Memory\% Committed Bytes In Use'
    $memoryUsage = [math]::Round($memCounter.CounterSamples[0].CookedValue, 2)

    # Retrieve network usage (summed over all interfaces)
    $netCounters = Get-Counter '\Network Interface(*)\Bytes Total/sec'
    $networkUsage = [math]::Round(($netCounters.CounterSamples | Measure-Object -Property CookedValue -Sum).Sum, 2)

    return @{
        CPU     = $cpuUsage
        Memory  = $memoryUsage
        Network = $networkUsage
    }
}

# ------------------------------
# Main Monitoring Loop
# ------------------------------

Write-Log -message "Starting performance monitoring for BrightFeed." -filePath $logFile

while ($true) {
    # Get current performance metrics
    $metrics = Get-PerformanceMetrics
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "$timestamp, CPU: $($metrics.CPU)%, Memory: $($metrics.Memory)%, Network: $($metrics.Network) Bytes/sec"
    
    # Log current metrics
    Add-Content -Path $logFile -Value $logEntry

    # Baseline collection during the initial iterations
    if ($baselineCpu.Count -lt $baselineIterations) {
        $baselineCpu += $metrics.CPU
        $baselineMemory += $metrics.Memory
        $baselineNetwork += $metrics.Network

        if ($baselineCpu.Count -eq $baselineIterations) {
            $avgCpu = [math]::Round(($baselineCpu | Measure-Object -Average).Average,2)
            $avgMemory = [math]::Round(($baselineMemory | Measure-Object -Average).Average,2)
            $avgNetwork = [math]::Round(($baselineNetwork | Measure-Object -Average).Average,2)
            $baselineData = "Baseline Metrics (averaged over $baselineIterations minutes): CPU: $avgCpu%, Memory: $avgMemory%, Network: $avgNetwork Bytes/sec"
            Write-Log -message $baselineData -filePath $logFile

            # Save baseline metrics to a CSV file
            $csvContent = "Metric,AverageValue`nCPU,$avgCpu`nMemory,$avgMemory`nNetwork,$avgNetwork"
            $csvContent | Out-File -FilePath $baselineFile -Encoding utf8
        }
    }

    # Check thresholds and send alerts if metrics exceed acceptable values
    if ($metrics.CPU -gt $cpuThreshold) {
        Send-Alert "High CPU Usage detected: $($metrics.CPU)% exceeds threshold of $cpuThreshold%."
    }
    if ($metrics.Memory -gt $memoryThreshold) {
        Send-Alert "High Memory Usage detected: $($metrics.Memory)% exceeds threshold of $memoryThreshold%."
    }
    if ($metrics.Network -gt $networkThreshold) {
        Send-Alert "High Network Usage detected: $($metrics.Network) Bytes/sec exceeds threshold of $networkThreshold Bytes/sec."
    }

    # Wait for 60 seconds before collecting the next set of metrics
    Start-Sleep -Seconds 60
}