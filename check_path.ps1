$target = "C:\Program Files\nodejs"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$sysPath = [Environment]::GetEnvironmentVariable("Path", "Machine")

Write-Host "Checking User Path..."
if ($userPath -like "*$target*") { Write-Host "FOUND in User Path" } else { Write-Host "NOT FOUND in User Path" }
$userPath -split ";" | ForEach-Object { if ($_ -like "*nodejs*") { Write-Host "User Candidate: '$_'" } }

Write-Host "Checking System Path..."
if ($sysPath -like "*$target*") { Write-Host "FOUND in System Path" } else { Write-Host "NOT FOUND in System Path" }
$sysPath -split ";" | ForEach-Object { if ($_ -like "*nodejs*") { Write-Host "System Candidate: '$_'" } }
