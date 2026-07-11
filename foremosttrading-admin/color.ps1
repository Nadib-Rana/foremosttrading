Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile('c:\Sabbir\foremosttrading\foremosttrading-frontend\public\logo\Logo.png')
$colors = @{}

for ($x = 0; $x -lt $bmp.Width; $x += 5) {
    for ($y = 0; $y -lt $bmp.Height; $y += 5) {
        $color = $bmp.GetPixel($x, $y)
        # ignore transparent and almost white
        if ($color.A -gt 10 -and ($color.R -lt 240 -or $color.G -lt 240 -or $color.B -lt 240)) {
            $hex = '#{0:X2}{1:X2}{2:X2}' -f $color.R, $color.G, $color.B
            if ($colors.ContainsKey($hex)) {
                $colors[$hex]++
            } else {
                $colors[$hex] = 1
            }
        }
    }
}

$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5
