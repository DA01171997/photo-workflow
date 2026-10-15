### WINDOW



```powershell
# Open powershell profile and paste in the following code setup to enable MSVC environment
code $PROFILE
```

```powershell
# Initialize Node.js version manager
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression

# Configure MSVC environment
function Enable-MSVC {
    cmd /c '"C:\Program Files (x86)\Microsoft Visual Studio\18\BuildTools\Common7\Tools\VsDevCmd.bat" -arch=x64 -host_arch=x64 >nul && set' | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
        }
    }
}

# Automatically load MSVC
Enable-MSVC
```