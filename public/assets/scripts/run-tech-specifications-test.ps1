# --- Speed Test

$URL = "https://install.speedtest.net/app/cli/ookla-speedtest-1.2.0-win64.zip"
$output = Join-Path $PSScriptRoot "speedtest.zip"
$exe = Join-Path $PSScriptRoot  "speedtest.exe"
$md = Join-Path $PSScriptRoot  "speedtest.md"
$techSpecificationsResults = Join-Path $PSScriptRoot "results\tech-specifications-results.txt"
$params = "--accept-license --progress=no"
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $URL -OutFile $output -Headers @{"Cache-Control"="no-cache"}
Expand-Archive -Path $output -DestinationPath $PSScriptRoot -Force

# Runs Speedtest and outputs to a text file
Start-Process -FilePath $exe -ArgumentList $params -Wait -RedirectStandardOutput $techSpecificationsResults  -WindowStyle Hidden

# Remove leftover files from program
Remove-Item -Path $output -Force
Remove-Item -Path $exe -Force
Remove-Item -Path $md -Force

# Next line
Add-Content $techSpecificationsResults "`n" 

# ---- Connection Type

$internetConnection = Test-NetConnection
$type = $internetConnection.InterfaceAlias
Add-Content $techSpecificationsResults "Connection Type: $type" 

# ---- System Info

$systemOS = (Get-ComputerInfo -Property "os*").OsName
$systemRam = (Get-ComputerInfo -Property "os*").OsTotalVisibleMemorySize / 1000000
$processor = (Get-CimInstance -ClassName Win32_Processor).Name
$systemInformation = systeminfo
$manufacturer = $systemInformation | Select-String "System Manufacturer"
$model  = $systemInformation | Select-String "System Model"
$type   = $systemInformation | Select-String "System Type"

Add-Content $techSpecificationsResults "OS: $systemOS"
Add-Content $techSpecificationsResults "Processor: $processor"
Add-Content $techSpecificationsResults "RAM: $systemRam GB"
Add-Content $techSpecificationsResults "$manufacturer"
Add-Content $techSpecificationsResults "$model" 
Add-Content $techSpecificationsResults "$type" 

# ---- OS Status

$ActivationStatus = Get-CimInstance SoftwareLicensingProduct -Filter "Name like 'Windows%'" | Where-Object { $_.PartialProductKey } | Select-Object LicenseStatus       
$LicenseStatus = $ActivationStatus.LicenseStatus

$LicenseResult = switch($LicenseStatus){
    0	{"Unlicensed"}
    1	{"Licensed"}
    2	{"OOBGrace"}
    3	{"OOTGrace"}
    4	{"NonGenuineGrace"}
    5	{"Not Activated"}
    6	{"ExtendedGrace"}
    default {"unknown"}
  }

Add-Content $techSpecificationsResults "License Status: $LicenseResult" 

# ---- Audio Device

cls
Add-Type @'
[Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice {
    int a(); int o();
    int GetId([MarshalAs(UnmanagedType.LPWStr)] out string id);
}
[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator {
    int f();
    int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
}
[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")] class MMDeviceEnumeratorComObject { }

public static string GetDefault (int direction) {
    var enumerator = new MMDeviceEnumeratorComObject() as IMMDeviceEnumerator;
    IMMDevice dev = null;
    Marshal.ThrowExceptionForHR(enumerator.GetDefaultAudioEndpoint(direction, 1, out dev));
    string id = null;
    Marshal.ThrowExceptionForHR(dev.GetId(out id));
    return id;
}
'@ -name audio -Namespace system

function getFriendlyName($id) {
    $reg = "HKLM:\SYSTEM\CurrentControlSet\Enum\SWD\MMDEVAPI\$id"
    return (get-ItemProperty $reg).FriendlyName
}

$id0 = [audio]::GetDefault(0)
$id1 = [audio]::GetDefault(1)

Add-Content $techSpecificationsResults "Default Speaker: $(getFriendlyName $id0)" 
Add-Content $techSpecificationsResults "Default Micro  : $(getFriendlyName $id1)"

# ---- Sound Devices

$audioDevices = (Get-CimInstance -ClassName Win32_SoundDevice -Property *)
Add-Content $techSpecificationsResults "Sound Devices" 
Add-Content $techSpecificationsResults "`n"

foreach ($device in $audioDevices) {
    Add-Content $techSpecificationsResults "$device.Manufacturer $device.ProductName" 
    Add-Content $techSpecificationsResults "`n" # Next line
}

Exit