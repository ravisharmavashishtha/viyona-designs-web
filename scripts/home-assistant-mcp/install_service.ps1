$action = New-ScheduledTaskAction -Execute "node.exe" -Argument "d:\DevSpace\3dprintingbusiness\scripts\home-assistant-mcp\mobile_bridge.js"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0

Register-ScheduledTask -TaskName "ViyonaStudioMobileBridge" -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Start-ScheduledTask -TaskName "ViyonaStudioMobileBridge"

$task = Get-ScheduledTask -TaskName "ViyonaStudioMobileBridge"
Write-Host "Task Name: $($task.TaskName)"
Write-Host "State:     $($task.State)"
