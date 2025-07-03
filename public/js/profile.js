function showTab(tab, event) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.profile-tabs li').forEach(tabEl => tabEl.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    if (event) event.target.classList.add('active');
  }