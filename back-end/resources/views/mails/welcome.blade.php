<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>Selamat Datang</title>
	<style>
		html, body {
			width: 100%;
		}
		.wrapper {
			width: 80%;
			margin: 0 auto;
			border: 1px solid #e7e7e7;
		}
		.container {
			padding: 20px;
		}
		.line {
			color: #e7e7e7;
		}
		footer {
			border-top: 2px solid #e7e7e7;
			background-color: #f7f7f7;
			padding: 10px;
			text-align: center;
		}
		footer p {
			font-size: 12px;
		}
	</style>
</head>
<body>
	<div class="wrapper">
		<div class="container">
			<img src="https://res.cloudinary.com/aguzs/image/upload/v1546095654/ecommerce.png" alt="ecommerce logo" width="140">
			<br>

			<h2>Pendaftaran Berhasil</h2>

			<p>Halo, {{ $data->name }}</p>
			<p>Terima kasih sudah daftar jadi member eCommerce!	Anda akan jadi yang pertama untuk menerima informasi produk-produk terbaru serta penawaran menarik.</p>
			<p>Kami tunggu pembelanjaan Anda di eCommerce.</p>

			<hr class="line">
			
			<p>Email dibuat secara otomatis. Mohon tidak mengirimkan balasan ke email ini.</p>
		</div>

		

		<footer>
			<p>Jika butuh bantuan, hubungi <a href="mailto:aguzsupriyatna7@gmail.com">Customer Service</a> kami.</p>
			<p>&copy; 2018, PT eCommerce Indonesia</p>
		</footer>
	</div>
</body>
</html>