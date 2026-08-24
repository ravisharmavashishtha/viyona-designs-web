async function searchMiraie() {
  const repos = [
    'saketkc/homeassistant-panasonic-miraie',
    'kashalls/homeassistant-panasonic-miraie',
    'rohit-kandula/panasonic-miraie-homeassistant'
  ];

  for (const repo of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: { 'User-Agent': 'Node-Fetch' }
      });
      const data = await res.json();
      console.log(`Repo: ${repo} | Stars: ${data.stargazers_count} | Default branch: ${data.default_branch}`);
    } catch (e) {
      console.error(e);
    }
  }
}

searchMiraie();
