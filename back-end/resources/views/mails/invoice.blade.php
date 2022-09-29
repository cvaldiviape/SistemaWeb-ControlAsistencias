<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>New Invoice</title>

	<style>
		body {
			width: 100%;
		}
		.wrapper {
			width: 80%;
			margin: 0 auto;
			border: 1px solid #e7e7e7;
		}
		.container {
			margin: 0 auto;
			padding: 20px;
		}
		.line	{
			color: #e7e7e7;
		}
		.detail {
			width: 90%;
		}
		table {
			width: 100%;
		}
		tr {
			width: 100%;
		}
		.align-right {
			text-align:right;
		}
		footer {
			border-top: 1px solid grey;
			padding: 15px;
			text-align: center;
			background-color: #e7e7e7;
		}
	</style>
</head>
<body>
	<div class="wrapper">
		<div class="container">
			<img src="https://res.cloudinary.com/aguzs/image/upload/v1546095654/ecommerce.png" alt="eCommerce Logo" width="140">
			<h3>Mohon Selesaikan Pembayaran Anda</h3>
			<p>Checkout berhasil pada tanggal {{ $createdAt }}</p>
			<table>
				<tr>
					<td><b>Invoice</b></td>
				</tr>
				<tr>
					<td>{{ $order->invoice }}</td>
				</tr>
			</table>
			<br>
			<table>
				<tr>
					<td style="width: 60%"><b>Total Pembayaran</b></td>
					<td><b>Batas Waktu Pembayaran</b></td>
				</tr>
				<tr>
					<td style="width: 60%">Rp {{ number_format($order->total_payment, 0, ',', '.') }}</td>
					<td>{{ $dueDate }}</td>
				</tr>
			</table>
			<br>
			<table>
				<tr>
					<td><b>Status Pembayaran</b></td>
				</tr>
				<tr>
					<td>Menunggu Pembayaran</td>
				</tr>
			</table>

			<br>
			<hr class="line">

			<h4 style="margin-bottom: 0px">Detail Pesanan</h4>
			
			<div class="detail">
				<table>
					<tr>
						<td>
							<p style="color:#007CC2;">{{ $order->invoice }}</p>
						</td>
					</tr>
				</table>
				<table>
					@foreach ($order->details()->get() as $item)
					<tr>
						<td style="width: 60%">{{ $item->product_name }} (Size {{ $item->size }})</td>
						<td class="align-right">Rp {{ number_format($item->price, 0, ',', '.') }}</td>
					</tr>
					@endforeach
				</table>
				<table>
					<tr>
						<td style="width: 60%">Ongkos Kirim</td>
						<td class="align-right">Rp {{ number_format($order->shipping_cost, 0, ',', '.') }}</td>
					</tr>
				</table>
				<hr class="line">
				<table>
					<tr style="border-top: 1px solid #e7e7e7">
						<td>Total Pembayaran</td>
						<td class="align-right">Rp {{ number_format($order->total_payment, 0, ',', '.') }}</td>
					</tr>
				</table>
				<br>
			</div>

			<hr class="line">
			
			<br>
			<p>Email dibuat secara otomatis. Mohon tidak mengirimkan balasan ke email ini.</p>
		</div>
		<footer>
				<p>Jika butuh bantuan, hubungi <a href="mailto:aguzsupriyatna7@gmail.com">Customer Service</a> kami.</p>
				<p>&copy; 2018, PT eCommerce Indonesia</p>
		</footer>
	</div>
</body>
</html>