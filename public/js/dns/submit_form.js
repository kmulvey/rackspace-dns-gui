function submit_form(form) {
	$('#submit').on('click', function(e) {
		$('.control-group').removeClass('error');
		$('.control-group .help-inline').remove();
		$('#result').addClass('hidden');
		$('.progress').removeClass('hidden').addClass('active');
		e.preventDefault();

		var valid_ip_regex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
		var valid_hostname_regex = new RegExp("^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$", "i");
		var host = $('#host');
		host_val = host.val().replace('http://', '');

		if (!valid_hostname_regex.test(host_val) && !valid_ip_regex.test(host_val)) {
			host.after("<span class='help-inline'>Invalid Hostname or IP</span>");
			$('.control-group').addClass('error');
			$('.progress').removeClass('active').addClass('hidden');
			return false;
		}
		$.post('/'+form, $('#'+form+'-form').serialize(), function(data) {
			$('pre.results').html(data);
			$('#result').removeClass('hidden');
			$('.progress').removeClass('active').addClass('hidden');
		}).error(function() {
			host.after("<span class='help-inline'>Processing error.</span>");
			$('.control-group').addClass('error');
			$('.progress').removeClass('active').addClass('hidden');
		});
	});
	$('#'+form+'-form').submit(function() {
		$('#submit').click();
		return false;
	});
}