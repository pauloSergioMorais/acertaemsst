$(function(){
	
	// vars
	var $window	= $(window);
	
	// midia
	var $midia_imagem		= $("#d-midia-imagem"),
		$midia_imagem_img	= $("#d-midia-imagem-img"),
		$midia_video		= $("#d-midia-video"),
		$midia_galeria		= $(".d-midia-galeria-botao"),
		$midia_this			= "";

	$midia_galeria.on("click", function(){
		$midia_this = $(this);

		if ($midia_this.hasClass("d-midia-galeria-botao-video")) {
			$midia_imagem.addClass("display-none");
			$midia_video.removeClass("display-none");
		}
		else {
			$midia_imagem_img.attr("src", $midia_this.find("img").attr("src"));

			if ($midia_imagem.hasClass("display-none")) {
				$midia_imagem.removeClass("display-none");
				$midia_video.addClass("display-none");
			}
		}
	});
	
	// relacionados
	var $relacionados_slider	= $("#d-relacionados-slider"),
		$relacionados_setas		= $(".d-relacionados-setas"),
		$relacionados_this		= "",
		
		_relacionados_atual		= 0,
		_relacionados_total		= 7;
	
	var fn_relacionados_resize = (function(){
		$relacionados_slider.css("transform", "none");
		_relacionados_atual	= 0;
		
		if ($window.width() < 480) {
			_relacionados_total = 6;
		}
		else if (($window.width() >= 720) && ($window.width() < 960)) {
			_relacionados_total = 4;
		}
		else if ($window.width() >= 960) {
			_relacionados_total = 2;
		}
	});
	
	$window.on("resize", fn_relacionados_resize);
	fn_relacionados_resize();
	
	$relacionados_setas.on("click", function(){
		$relacionados_this = $(this);
		
		if (($relacionados_this.attr("id") == "d-relacionados-setas-e") && (_relacionados_atual > 0)) {
			_relacionados_atual--;
		}
		else if (($relacionados_this.attr("id") == "d-relacionados-setas-d") && (_relacionados_atual < _relacionados_total)) {
			_relacionados_atual++;
		}
		
		$relacionados_slider.css("transform", "translateX(-" + (_relacionados_atual * 100 / 8) + "%)");
	});
	
	// orcamento
	var $botao_solicitar	= $("#botao-solicitar-orcamento"),
		$input_quantidade	= $("#input-quantidade-orcamento"),
		$input_tamanho		= $("#input-tamanho-orcamento"),
		$cart_botao_numero	= $("#cart-botao-numero"),
		$orcamento_lista	= $(".orcamento-lista"),
		$orcamento			= $("#orcamento"),
		$concluir_pedido	= $("#botao-concluir-pedido"),
		$mais_produtos		= $("#botao-mais-produtos"),
		$concluir_topo		= $("#concluir-pedido-topo"),
		$sem_resultados		= $("#div-sem-resultados"),
		$orcamento_topo		= $("#topo-orcamento");
	
	$botao_solicitar.on("click", function(){
		var $this		= $(this),
			quantidade	= parseInt($input_quantidade.val());
		
		if (quantidade < 1) {
			quantidade = 1;
		}
		
		var item		= $this.attr("data-item"),
			banco		= $this.attr("data-banco"),
			categoria	= $this.attr("data-categoria"),
			url			= $this.attr("data-url"),
			linha		= $this.attr("data-linha"); // se a base é UNI a linha é o subgrupo
		
		$.post("ajax/cart-add.php", {
			item		: item,
			banco		: banco,
			quantidade	: quantidade,
			tamanho		: $input_tamanho.val(),
			categoria	: categoria,
			url			: url
		},function(e){
			e = e.split("###");
			
			if (e[0] == 1) {
				localStorage.setItem("cart", e[1]);
				$cart_botao_numero.html(e[2]);
				$orcamento_lista.prepend(e[3]);
				
				if(e[2] > 0){
					$concluir_pedido.removeClass("display-none");
					var url_href = "";
					if(banco == "CIA"){
						url_href = "produtos/"+categoria+"/"+url+"/?linhas="+linha;
					}else{
						url_href = "uniformes/"+categoria+"/"+linha+"/"+url+"/?";
					}
					$mais_produtos.attr("href", url_href);
					$concluir_topo.removeClass("orcamento-topo-icone-inativo");
					$sem_resultados.addClass("display-none");
				}else{
					$concluir_pedido.addClass("display-none");
					$mais_produtos.attr("href", "/site");
					$concluir_topo.addClass("orcamento-topo-icone-inativo");
					$sem_resultados.removeClass("display-none");
				}
				
				$orcamento.addClass("orcamento-ativo");
			}
			else if(e[0] == 2){
				$(".orcamento-li-configuracao").each(function(){
					var $orcamento_this = $(this);
					if($orcamento_this.attr("data-item") == item && $orcamento_this.attr("data-banco") == banco){
						$orcamento_this.find("input").val(quantidade);
					}
				});
				
				$orcamento_topo.trigger("click");
				
			}
			else {
				// console.log("ocorreu um erro");
				// $detalhes_compra_alerta.removeClass("display-none").html("Ocorreu um erro, tente novamente.");
			}
		});
	});
	
	$input_quantidade.keydown(function(e){
		if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 8 || e.keyCode == 46) {
			return true;
		}
		else {
			return false;
		}
	});
	
	$input_quantidade.blur(function(){
		var $this = $(this);
		
		if (Number.isInteger(parseInt($this.val()))) {
			if ($this.val() <= 0) {
				$this.val(1);
			}
		}
		else {
			$this.val(1);
		}
	});
	
});