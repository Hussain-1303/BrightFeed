<#
.SYNOPSIS
    Automates installing and configuring performance monitoring for BrightFeed.

.DESCRIPTION
    1. Installs Docker and Docker Compose (via Chocolatey).
    2. Prepares a docker-compose.yml for Prometheus & Grafana.
    3. Creates basic Prometheus config files (prometheus.yml, alertmanager.yml).
    4. Spins up containers and ensures they are running.
    5. Installs k6 for load testing and performs a basic test to establish a baseline.
    6. Outlines scheduled task creation for ongoing reporting (commented for manual setup).

.NOTES
    Requires admin privileges to install software and run Docker.
    Adjust paths, thresholds, or container versions as needed.
#>

param(
    [string]$BrightFeedPath = "C:\BrightFeed",
    [string]$PrometheusVersion = "v2.42.0",
    [string]$GrafanaVersion = "9.2.0",
    [string]$AlertmanagerVersion = "v0.25.0"
)

# ---------------------------
# 1. Define Key Metrics & Thresholds (Documented, not fully scripted)
# ---------------------------
Write-Host "`n=== Step 1: Documenting Metrics & Thresholds ==="
Write-Host "CPU usage threshold: 80%"
Write-Host "Memory usage threshold: 80%"
Write-Host "Network usage threshold: depends on environment capacity"
Write-Host "p95 response time threshold: 300ms (example)"
Write-Host "Threshold documentation is typically kept in a central reference."

# ---------------------------
# 2. Install Required Tools
# ---------------------------
Write-Host "`n=== Step 2: Installing Docker (and Docker Compose) via Chocolatey ==="
Write-Host "Checking if Chocolatey is installed..."

if ($null -eq (Get-Command choco.exe -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey is not installed. Installing now..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = "tls12"
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey is already installed."
}

Write-Host "Installing/Upgrading Docker..."
choco install docker-cli --version=20.10.23 -y
choco install docker-desktop -y

Write-Host "Installing/Upgrading k6 for performance testing..."
choco install k6 -y

Write-Host "Ensuring Docker service is running..."
Start-Process "powershell" -ArgumentList "Start-Service com.docker.service" -Verb RunAs -Wait

# ---------------------------
# 3. Create Docker Compose Configuration for Prometheus & Grafana
# ---------------------------
Write-Host "`n=== Step 3: Configuring Prometheus & Grafana in Docker Compose ==="
Write-Host "Creating $BrightFeedPath\docker-compose.yml ..."

if (!(Test-Path $BrightFeedPath)) {
    New-Item -ItemType Directory -Path $BrightFeedPath | Out-Null
}

$dockerComposeContent = @"
version: '3.7'
services:
  prometheus:
    image: prom/prometheus:${PrometheusVersion}
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9090:9090"
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--web.enable-lifecycle"

  alertmanager:
    image: prom/alertmanager:${AlertmanagerVersion}
    container_name: alertmanager
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
    ports:
      - "9093:9093"
    command:
      - "--config.file=/etc/alertmanager/alertmanager.yml"

  grafana:
    image: grafana/grafana:${GrafanaVersion}
    container_name: grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
"@

Set-Content -Path "$BrightFeedPath\docker-compose.yml" -Value $dockerComposeContent -Encoding UTF8

# ---------------------------
# 4. Create Basic Prometheus Config & Alertmanager Config
# ---------------------------
Write-Host "`n=== Step 4: Creating basic Prometheus and Alertmanager configuration ==="

$prometheusConfig = @"
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['prometheus:9090']

  # Example: Windows Exporter or Node Exporter can be added
  # - job_name: 'node_exporter'
  #   static_configs:
  #     - targets: ['some-node-exporter:9100']

alerting:
  alertmanagers:
    - static_configs:
      - targets: ['alertmanager:9093']

rule_files:
  # Here you can reference alert rule files if you have them
  # - 'alert_rules.yml'
"@

Set-Content -Path "$BrightFeedPath\prometheus.yml" -Value $prometheusConfig -Encoding UTF8

# Basic alertmanager config with a dummy route
$alertmanagerConfig = @"
route:
  receiver: 'default-receiver'

receivers:
  - name: 'default-receiver'
    # Example email config, Slack, etc. would go here
    # email_configs:
    #   - to: 'your.email@example.com'
"@

Set-Content -Path "$BrightFeedPath\alertmanager.yml" -Value $alertmanagerConfig -Encoding UTF8

# ---------------------------
# 5. Spin Up Monitoring Containers
# ---------------------------
Write-Host "`n=== Step 5: Starting Prometheus, Alertmanager, and Grafana containers ==="
Push-Location $BrightFeedPath
docker-compose up -d
Pop-Location

Write-Host "Containers are starting. Please allow a minute for services to initialize."

# ---------------------------
# 6. Perform Initial Load/Performance Testing (Baseline)
# ---------------------------
Write-Host "`n=== Step 6: Running a basic load test with k6 to establish baseline ==="

# Sample test script (adjust to match your environment/endpoints)
$k6Test = @"
import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get('http://localhost:3000');  // Example: If BrightFeed is running on port 3000
  sleep(1);
}
"@

Set-Content -Path "$BrightFeedPath\k6-baseline-test.js" -Value $k6Test -Encoding UTF8

Write-Host "Running k6 test..."
Push-Location $BrightFeedPath
k6 run .\k6-baseline-test.js
Pop-Location

Write-Host "Baseline load test completed. Check Prometheus/Grafana for metrics."

# ---------------------------
# 7. Configure Automated Alerts & Reports
# ---------------------------
Write-Host "`n=== Step 7: Configuring Alerts & Reports ==="
Write-Host "1) Edit 'alertmanager.yml' with actual alert routes (e.g., email, Slack)."
Write-Host "2) Add alert rules in a separate .rules.yml file or in 'prometheus.yml'."
Write-Host "3) Confirm that thresholds match the ones you documented earlier."
Write-Host "4) (Optional) Use Grafana alerting or your chosen method for real-time notifications."

# ---------------------------
# 8. (Optional) Schedule Regular Performance Reporting
# ---------------------------
Write-Host "`n=== Step 8: Setting Up a Scheduled Task (Optional) ==="
Write-Host "Below is an example of how you could schedule a task to run a report script."

$taskName = "BrightFeedPerformanceReport"
$psScriptPath = Join-Path $BrightFeedPath "Generate-PerformanceReport.ps1"

$reportScript = @"
# This script might query Prometheus/Grafana APIs or gather logs and email them to stakeholders
Write-Host 'Generating performance report...'
# (Implementation depends on your reporting preferences)
"@

# Create a placeholder reporting script
Set-Content -Path $psScriptPath -Value $reportScript -Encoding UTF8

Write-Host "`nTo schedule a daily performance report, you could run something like:"
Write-Host "Register-ScheduledTask -TaskName '$taskName' -Trigger (New-ScheduledTaskTrigger -Daily -At 6am) -Action (New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-File $psScriptPath') -RunLevel Highest"

Write-Host "`n=== Script Complete ==="
Write-Host "Prometheus: http://localhost:9090"
Write-Host "Alertmanager: http://localhost:9093"
Write-Host "Grafana: http://localhost:3000 (Username: admin, Password: admin)"
