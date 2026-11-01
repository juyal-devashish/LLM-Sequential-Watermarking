"""Paired score-stream calibration, not an OPT/C4 benchmark."""
import json, subprocess, time, hashlib
from pathlib import Path
import numpy as np
from scipy.stats import binom
rng=np.random.default_rng(20261101)
trials,budget=5000,100
scores=rng.random((trials,budget+1))
losses=np.cumsum(scores[:,1:] <= scores[:,:1],axis=1)
wealth=binom.sf(losses,np.arange(1,budget+1)+1,.04)/.04
cross=(wealth>=20)|(wealth<.05)
stop=np.where(cross.any(axis=1),cross.argmax(axis=1)+1,budget)
seq=np.array([wealth[i,:b].max()>=20 for i,b in enumerate(stop)])
fixed=(losses[:,-1]+1)/(budget+1)<=.05
out={'kind':'synthetic_exchangeable_score_calibration','seed':20261101,'trials':trials,'budget':budget,'alpha':.05,'c':.04,'source_commit':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'note':'Same Uniform(0,1) observed/null scores for both tests. Not text detection performance.','sequential_rejections':int(seq.sum()),'fixed_rejections':int(fixed.sum()),'sequential_rate':float(seq.mean()),'fixed_rate':float(fixed.mean()),'sequential_median_resamples':float(np.median(stop))}
for name,flags in [('sequential',seq),('fixed',fixed)]:
 # Wilson 95% interval; calibration evidence, not a proof.
 p=float(flags.mean());z=1.96;d=1+z*z/trials;center=(p+z*z/(2*trials))/d;half=z*np.sqrt(p*(1-p)/trials+z*z/(4*trials*trials))/d
 out[name+'_wilson95']=[center-half,center+half]
out['source_worktree_dirty'] = bool(subprocess.check_output(['git','status','--porcelain'],text=True).strip())
out['detector_sha256'] = hashlib.sha256(Path('src/watermarking/detection.py').read_bytes()).hexdigest()
Path('results/exhibit/calibration.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps(out,indent=2))
