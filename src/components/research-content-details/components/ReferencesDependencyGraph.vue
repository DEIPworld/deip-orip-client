<template>
  <div :style="{ width: width + 'px', height: height + 'px', border: '1px solid black' }">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
      <defs>
        <pattern id="innerGrid" :width="innerGridSize" :height="innerGridSize" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="none" stroke="#CCCCCC7A" stroke-width="0.5"/>
        </pattern>
        <pattern id="grid" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
          <rect width="100%" height="100%" fill="url(#innerGrid)" stroke="#CCCCCC7A" stroke-width="1.5"/>
        </pattern>
      </defs>
    </svg>
  </div>
</template>

<script>
import moment from "moment";
import * as d3 from "d3";

export default {
  name: "ReferencesDependencyGraph",
  props: {
    data: { type: Object, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  data() {
    return {
      gridSize: 100,
      refInfoWidth: 500,
      refInfoHeight: 240,
      selections: {},
      simulation: null,
      forceProperties: {
        center: {
          // x: 0.5,
          // y: 0.5
          x: this.width / 2,
          y: this.height / 2
        },
        // charge: {
        //   enabled: true,
        //   strength: -700,
        //   distanceMin: 1,
        //   distanceMax: 2000
        // },
        collide: {
          enabled: true,
          strength: 1,
          iterations: 0,
          radius: 50
        },
        // forceX: {
        //   enabled: true,
        //   strength: 0.05,
        //   x: 0.5
        // },
        // forceY: {
        //   enabled: true,
        //   strength: 0.35,
        //   y: 0.5
        // },
        link: {
          enabled: true,
          strength: 1,
          iterations: 0,
          distance: 100
        }
      },
    }
  },

  computed: {
    innerGridSize() { return this.gridSize / 10 },
    nodes() {
      const root = this.data.nodes.find(ref => ref.isRoot);

      const findChildren = (parent, list) => {
        let children = list.filter(node => node.parent == parent.id);
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            child.children = findChildren(child, list);
        }
        return children;
      }

      const buildTree = (root, list) => {
        root.children = list.filter(node => node.parent == root.id);
        for (let i = 0; i < root.children.length; i++) {
            let child = root.children[i];
            child.children = findChildren(child, list);
        }
        return root;
      }

      const innerReferencesTreeModels = [root, ...this.data.nodes.filter(ref => ref.isInner)].map(ref => { return {
          id: ref.researchContent.id,
          parent: ref.to,
          name: ref.researchContent.title,
          children: []
      }})
      const innerReferencesTreeData = buildTree(innerReferencesTreeModels[0], innerReferencesTreeModels);
      const innerReferencesTreemap = d3.tree().nodeSize([150, 150]); // .size([this.width, this.height]);
      const innerReferencesTreeNodes = d3.hierarchy(innerReferencesTreeData);
      const innerReferencesTreeRoot = innerReferencesTreemap(innerReferencesTreeNodes);


      const outerReferencesTreeModels = [root, ...this.data.nodes.filter(ref => ref.isOuter)].map(ref => { return {
          id: ref.researchContent.id,
          parent: ref.to,
          name: ref.researchContent.title,
          children: []
      }})
      const outerReferencesTreeData = buildTree(outerReferencesTreeModels[0], outerReferencesTreeModels);
      const outerReferencesTreemap = d3.tree().nodeSize([150, 150]); // .size([this.width, this.height]);
      const outerReferencesTreeNodes = d3.hierarchy(outerReferencesTreeData);
      const outerReferencesTreeRoot = outerReferencesTreemap(outerReferencesTreeNodes);

      const getCoords = (id, node) => {
        if (id == node.data.id) {
          return { x: node.x, y: node.y }; 
        }

        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            let coords = getCoords(id, child)
            if (coords) return coords;
          }
        }
      }

      let nodes = this.data.nodes.map((node, i) => {
        if (node.isInner) {
          let { x, y } = getCoords(node.researchContent.id, innerReferencesTreeRoot);
          return { ...node, x, y: -y };
        }
        if (node.isRoot) {
          let { x, y } = innerReferencesTreeRoot;
          return { ...node, x, y };
        }
        if (node.isOuter) {
          let { x, y } = getCoords(node.researchContent.id, outerReferencesTreeRoot);
          return { ...node, x, y };
        }
      })

      // console.log(nodes);

      return nodes; 
    },
    links() { return this.data.links },
    // These are needed for captions
    linkTypes() {
      const linkTypes = []
      this.links.forEach(link => {
        if (!linkTypes.some(l => link.type == l.type)) {
          let text = link.type == "depends" ? "Reference" : link.type == "needs" ? "Used by" : "Link"
          linkTypes.push({...link, text });
        }
      });
      return linkTypes.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
    },
    nodeTypes() {
      const nodeTypes = []
      this.nodes.forEach(node => {
        if (!nodeTypes.some(n => node.refType == n.refType)) {
          let text = node.refType == "root" ? "Primary data" : node.refType == "in" ? "Data providers" : node.refType == "out" ? "Data users" : "Node";
          nodeTypes.push({ ...node, text });
        }
      })
      return nodeTypes.sort((a, b) => (a.refType > b.refType) ? 1 : ((b.refType > a.refType) ? -1 : 0));
    }
  },

  methods: {
    tick() {
      // If no data is passed to the Vue component, do nothing
      if (!this.data) { return }
      const transform = d => {
        return "translate(" + d.x + "," + d.y + ")"
      }
      const link = d => {
        // Self-link support
        if (d.source.index === d.target.index) {
          return `M${d.source.x-1},${d.source.y-1}A30,30 -10,1,0 ${d.target.x+1},${d.target.y+1}`;
        } else {
          return "M" + d.source.x + "," + d.source.y + " L" + d.target.x + "," + d.target.y;
        }
      }
      const graph = this.selections.graph
      graph.selectAll("path").attr("d", link)
      graph.selectAll(".ref-node").attr("transform", transform)
      graph.selectAll(".ref-info").attr("transform", transform)

      this.updateNodeLinkCount()
    },
    updateData() {
      const filters = this.$options.filters;
      this.simulation.nodes(this.nodes)
      this.simulation.force("link").links(this.links)
      const simulation = this.simulation
      const graph = this.selections.graph
      // Links should only exit if not needed anymore
      graph.selectAll("path")
        .data(this.links)
      .exit().remove()
      graph.selectAll("path")
        .data(this.links)
      .enter().append("path")
        .attr("class", d => "link " + d.type)
      // Nodes should always be redrawn to avoid lines above them

      graph.selectAll(".ref-node").remove()
      let node = graph.selectAll(".ref-node")
        .data(this.nodes)
      .enter().append("g")
      .attr("class", "ref-node")
      .attr("id", d => { return `ref-node-${d.researchContent.id}`})

      node.append("circle")
        .attr("r", 30)
        .attr("class", d => d.refType)
        .call(d3.drag()
          .on('start', this.nodeDragStarted)
          .on('drag', this.nodeDragged)
          .on('end', this.nodeDragEnded))
        // .on('mouseover', d => { this.nodeMouseOver(d) })
        // .on('mouseout', d => { this.nodeMouseOut(d) })
        .on('click', d => { this.nodeClick(d) })
      
      node.append("text")
        .attr("class", "ref-title")
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(d => d.contentType.shortText || d.contentType.text)
        .on("mousedown", () => {
          d3.event.stopPropagation();
        })
        .on("dblclick", () => {
          d3.event.stopPropagation();
        });
      
      node.append("image")
        .attr("class", "ref-org-logo")
        .attr("x", -15)
        .attr("y", -25)
        .attr("xlink:href", d => { return filters.researchGroupLogoSrc(d.researchGroup.id, 50, 50, true) })
        .attr("height", 30)
        .attr("width", 30)
        .call(d3.drag()
          .on('start', this.nodeDragStarted)
          .on('drag', this.nodeDragged)
          .on('end', this.nodeDragEnded))
        // .on('mouseover', d => { this.nodeMouseOver(d) })
        // .on('mouseout', d => { this.nodeMouseOut(d) })
        .on('click', d => { this.nodeClick(d) })
      

      graph.selectAll(".ref-info").remove()
      let refInfo = graph.selectAll(".ref-info")
        .data(this.nodes)
        .enter()
        .append("foreignObject")
          .attr("x", 10)
          .attr("y", 10)
          .attr("width", this.refInfoWidth)
          .attr("height", this.refInfoHeight)
          .attr("visibility", "hidden")
          .attr("id", d => { return `ref-info-${d.researchContent.id}`})
          .attr("class", "ref-info")
          .on("mousedown", () => {
            d3.event.stopPropagation();
          })
          .on("dblclick", () => {
            d3.event.stopPropagation();
          })
          .append("xhtml:div")
            .attr("xmlns", "http://www.w3.org/1999/xhtml")
            .attr("class", "ref-info-box")
            .style("height", this.refInfoHeight + "px")
            .style("overflow-y", "scroll");
      

      let refInfoBox = refInfo
        .append("xhtml:div")
        .attr("width", "100%")

      let hashTextBox = refInfoBox
        .append("xhtml:div")
        .attr("class", "ref-info-hash-box")

      hashTextBox.append("xhtml:span")
        .attr("class", "ref-info-hash-algo")
        .text("SHA256")

      hashTextBox.append("xhtml:span")
        .attr("class", "ref-info-hash-value")
        .text(d => { return d.researchContent.content.split(":")[1]; })

      let titleLinkBox = refInfoBox.append("xhtml:div")
        .attr("class", "ref-info-title-box");

      titleLinkBox.append("xhtml:a")
        .attr("href", d => { return true
          ? `/#/${d.researchGroup.permlink}/research/${d.research.permlink}/${d.researchContent.permlink}` 
          : `/#/${d.researchGroup.permlink}/research/${d.research.permlink}?accessRequestTo=${d.researchContent.id}` // redirect to Project page to request access
        })
        .attr("target", "_blank")
        .attr("class", "a ref-info-title-link")
        .text(d => { return d.researchContent.title; })


      let organizationBox = refInfoBox.append("xhtml:div")
        .attr("class", "ref-info-org-box");

      let organizationLabel = organizationBox.append("xhtml:div")
        .attr("class", "ref-info-org-label")
        .text("Organization:")

      let organizationContent = organizationBox.append("xhtml:div")
        .attr("class", "ref-info-org-content")

      let organizationItem = organizationContent.append("xhtml:span")
        .attr("class", "ref-info-org");

      let organizationName = organizationItem.append("xhtml:span")
        .attr("class", "ref-info-org-name")
        .text(d => { return d.researchGroup.name; })

      let organizationLogo = organizationItem.append("xhtml:img")
        .attr("src", d => { return filters.researchGroupLogoSrc(d.researchGroup.id, 50, 50, true) })
        .attr("target", "_blank")
        .attr("class", "ref-info-org-logo");


      let authorsBox = refInfoBox.append("xhtml:div")
        .attr("class", "ref-info-authors-box")

      let authorsLabel = authorsBox.append("xhtml:div")
        .attr("class", "ref-info-authors-label")
        .text("Authors:")

      let authorsContent = authorsBox.append("xhtml:div")
        .attr("class", "ref-info-authors-content")

      let authorItem = authorsContent.selectAll('.ref-info-author')
        .data(d => d.researchContent.authorsProfiles)
        .enter().append('xhtml:a')
        .attr("class", "a ref-info-author")
        .attr("href", a => { return `/#/user-details/${a.profile._id}` })
        .attr("target", "_blank")
        .each(function(a, i) {

          let authorName = d3.select(this).append("xhtml:span")
            .attr("class", "ref-info-author-name")
            .text(filters.fullname(a));

          let authorImg = d3.select(this).append("xhtml:img")
            .attr("src", filters.avatarSrc(a.profile, 60, 60, true, false))
            .attr("target", "_blank")
            .attr("class", "ref-info-author-img")
        });


      let contentAccessBox = refInfoBox.append("xhtml:div")
        .attr("class", "ref-info-access-box");

      let contentAccessLabel = contentAccessBox.append("xhtml:div")
        .attr("class", "ref-info-access-label")
        .text("Access to Material:")

      let contentAccessContent = contentAccessBox.append("xhtml:div")
        .attr("class", "ref-info-access-content")

      let contentAccessItem = contentAccessContent.append("xhtml:span")
        .attr("class", "ref-info-access")

      let contentAccessText = contentAccessItem.append("xhtml:span")
        .attr("class", "ref-info-access-text")
        .text(d => { return true ? `Access granted` : `No access`; })

      let contentAccessIcon = contentAccessItem.append("xhtml:img")
        .attr("src", d => { return true ? `/static/unlocked.png` : `/static/locked.png` })
        .attr("class", "ref-info-access-icon");


      let datetimeBox = refInfoBox.append("xhtml:div")
        .attr("class", "ref-info-datetime-box");

      let datetimeLabel = datetimeBox.append("xhtml:div")
        .attr("class", "ref-info-datetime-label")
        .text("Date:")

      let datetimeContent = datetimeBox.append("xhtml:div")
        .attr("class", "ref-info-datetime-content")

      let datetimeItem = datetimeContent.append("xhtml:span")
        .attr("class", "ref-info-datetime")

      let datetimeText = datetimeItem.append("xhtml:span")
        .attr("class", "ref-info-datetime-text")
        .text(d => { return moment(d.researchContent.created_at).format("D MMM YYYY"); })


      refInfoBox.on('wheel', (e) => {
        d3.event.stopPropagation();
        // d3.event.preventDefault();
      })

      // Add 'marker-end' attribute to each path
      const svg = d3.select(this.$el.querySelector("svg"))
      svg.selectAll("g").selectAll("path").attr("marker-end", d => {
        // Caption items doesn't have source and target
        if (d.source && d.target &&
          d.source.index === d.target.index) return "url(#end-self)";
        else return "url(#end)";
      });
      // Update caption every time data changes
      this.updateCaption()
      simulation.alpha(1).restart()
    },
    updateForces() {
      const { simulation, forceProperties, width, height } = this;
      
      simulation.force("center")
        .x(forceProperties.center.x)
        .y(forceProperties.center.y)
      // simulation.force("charge")
      //   .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
      //   .distanceMin(forceProperties.charge.distanceMin)
      //   .distanceMax(forceProperties.charge.distanceMax)
      simulation.force("collide")
        .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
        .radius(forceProperties.collide.radius)
        .iterations(forceProperties.collide.iterations)
      // simulation.force("forceX")
      //   .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
      //   .x(width * forceProperties.forceX.x)
      // simulation.force("forceY")
      //   .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
      //   .y(height * forceProperties.forceY.y)
      simulation.force("link")
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
      // updates ignored until this is run
      // restarts the simulation (important if simulation has already slowed down)
      simulation.alpha(1).restart()
    },
    updateNodeLinkCount() {
      let nodeCount = this.nodes.length;
      let linkCount = this.links.length;
      const highlightedNodes = this.selections.graph.selectAll(".ref-node.highlight");
      const highlightedLinks = this.selections.graph.selectAll("path.highlight");
      if (highlightedNodes.size() > 0 || highlightedLinks.size() > 0) {
        nodeCount = highlightedNodes.size()
        linkCount = highlightedLinks.size()
      }
      this.selections.stats.text('Materials: ' + nodeCount + ' / References: ' + linkCount);
    },
    updateCaption() {
      // WARNING: Some gross math will happen here!
      const lineHeight = 30
      const lineMiddle = (lineHeight / 2)
      const captionXPadding = 28
      const captionYPadding = 5
      const caption = this.selections.caption;
      caption.select('rect')
        .attr('height', (captionYPadding * 2) + lineHeight *
          (this.nodeTypes.length + this.linkTypes.length))
      const linkLine = (d) => {
        const source = {
          x: captionXPadding + 13,
          y: captionYPadding + (lineMiddle + 1) + (lineHeight * this.linkTypes.indexOf(d)),
        }
        const target = {
          x: captionXPadding - 10
        }
        return 'M' + source.x + ',' + source.y + 'H' + target.x
      }
      caption.selectAll('g').remove();
      const linkCaption = caption.append('g');
      linkCaption.selectAll('path')
        .data(this.linkTypes)
        .enter().append('path')
          .attr('d', linkLine)
          .attr('class', (d) => 'link ' + d.type)
      linkCaption.selectAll('text')
        .data(this.linkTypes)
        .enter().append('text')
          .attr('x', captionXPadding + 20)
          .attr('y', (d) => captionYPadding + (lineMiddle + 5) + (lineHeight * this.linkTypes.indexOf(d)))
          .attr('class', 'caption')
          .text((d) => d.text);
      const classCaption = caption.append('g');
      classCaption.selectAll('.ref-type')
        .data(this.nodeTypes)
        .enter().append('circle')
          .attr('r', 10)
          .attr('cx', captionXPadding - 2)
          .attr('cy', (d) => captionYPadding + lineMiddle + (lineHeight * (this.linkTypes.length + this.nodeTypes.indexOf(d))))
          .attr('class', (d) => `${d.refType} ref-type`);

      classCaption.selectAll('text')
        .data(this.nodeTypes)
        .enter().append('text')
          .attr('x', captionXPadding + 20)
          .attr('y', (d) => captionYPadding + (lineMiddle + 5) +
            (lineHeight * (this.linkTypes.length + this.nodeTypes.indexOf(d))))
          .attr('class', 'caption')
          .text((d) => d.text);
      
      const captionWidth = caption.node().getBBox().width;
      const captionHeight = caption.node().getBBox().height;
      const paddingX = 18;
      const paddingY = 18;
      caption
        .attr('transform', 'translate(' +
          (/* this.width - captionWidth - */ paddingX) + ', ' +
          (/* this.height - captionHeight - */ paddingY) + ')');
    },
    zoomed() {
      const transform = d3.event.transform
      // The trick here is to move the grid in a way that the user doesn't perceive
      // that the axis aren't really moving
      // The actual movement is between 0 and gridSize only for x and y
      const translate = transform.x % (this.gridSize * transform.k) + ',' + transform.y % (this.gridSize * transform.k)
      this.selections.grid.attr('transform', 'translate(' + translate + ') scale(' + transform.k + ')')
      this.selections.graph.attr('transform', transform)

      // Define some world boundaries based on the graph total size
      // so we don't scroll indefinitely
      // const graphBox = this.selections.graph.node().getBBox()
      // const margin = 200
      // const worldTopLeft = [graphBox.x - margin, graphBox.y - margin]
      // const worldBottomRight = [
      //   graphBox.x + graphBox.width + margin,
      //   graphBox.y + graphBox.height + margin
      // ]
      // this.zoom.translateExtent([worldTopLeft, worldBottomRight])
    },
    nodeDragStarted(d) {
      if (!d3.event.active) { this.simulation.alphaTarget(0.1).restart() }
      d.fx = d.x
      d.fy = d.y
    },
    nodeDragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    },
    nodeDragEnded(d) {
      if (!d3.event.active) { this.simulation.alphaTarget(0.00001) }
      d.fx = null
      d.fy = null
    },
    nodeMouseOver(d) {
      const graph = this.selections.graph
      const refNode = graph.selectAll(".ref-node")
      const path = graph.selectAll("path")
      const text = graph.selectAll(".ref-title")
      const related = []
      const relatedLinks = []
      related.push(d)
      this.simulation.force('link').links().forEach((link) => {
        if (link.source === d || link.target === d) {
          relatedLinks.push(link)
          if (related.indexOf(link.source) === -1) { related.push(link.source) }
          if (related.indexOf(link.target) === -1) { related.push(link.target) }
        }
      })
      refNode.classed('faded', true)
      refNode
        .filter((df) => related.indexOf(df) > -1)
        .classed('highlight', true)
      path.classed('faded', true)
      path
        .filter((df) => df.source === d || df.target === d)
        .classed('highlight', true)
      text.classed('faded', true)
      text
        .filter((df) => related.indexOf(df) > -1)
        .classed('highlight', true)
      // This ensures that tick is called so the node count is updated
      this.simulation.alphaTarget(0.00001).restart()
    },
    nodeMouseOut(d) {
      const graph = this.selections.graph
      const refNode = graph.selectAll(".ref-node")
      const path = graph.selectAll("path")
      const text = graph.selectAll(".ref-title")
      refNode.classed('faded', false)
      refNode.classed('highlight', false)
      path.classed('faded', false)
      path.classed('highlight', false)
      text.classed('faded', false)
      text.classed('highlight', false)
      // This ensures that tick is called so the node count is updated
      this.simulation.restart()
    },
    nodeClick(d) {
      const refNode = this.selections.graph.select(`#ref-node-${d.researchContent.id}`)
      const refInfoDialog = this.selections.graph.select(`#ref-info-${d.researchContent.id}`)
      const isHidden = refInfoDialog.attr("visibility") === "hidden";
      this.selections.graph.selectAll(".ref-info").attr('visibility', "hidden");

      refInfoDialog.attr('visibility', isHidden ? "visible" : "hidden");
      refNode.classed('selected', !isHidden);
    }
  },

  mounted() {
    this.selections.svg = d3.select(this.$el.querySelector("svg"))
    const svg = this.selections.svg

    // Define the arrow marker
    svg.append("svg:defs").selectAll("marker")
          .data(["end"])     // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 43)              // Prevents arrowhead from being covered by circle
          .attr("refY", 0)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
        .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");
    // Define arrow for self-links
    svg.append("svg:defs").selectAll("marker")
          .data(["end-self"])
        .enter().append("svg:marker")    // This section adds in the arrows
          .attr("id", String)
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 40)
          .attr("refY", -15)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", 285)
        .append("svg:path")
          .attr("d", "M0,-5L10,0L0,5");

    // Add zoom and panning triggers
    this.zoom = d3.zoom()
      .scaleExtent([1 / 4, 4])
      .on('zoom', this.zoomed)
    svg.call(this.zoom)

    // A background grid to help user experience
    // The width and height depends on the minimum scale extent and
    // the + 10% and negative index to create an infinite grid feel
    // The precedence of this element is important since you'll have
    // click events on the elements above the grid
    this.selections.grid = svg.append('rect')
      .attr('x', '-10%')
      .attr('y', '-10%')
      .attr('width', '410%')
      .attr('height', '410%')
      .attr('fill', 'url(#grid)')
    this.selections.graph = svg.append("g")
    const graph = this.selections.graph
    // Node and link count is nice :)
    this.selections.stats = svg.append('text')
      .attr('x', '1%')
      .attr('y', '98%')
      .attr('text-anchor', 'left');
    // Some caption
    this.selections.caption = svg.append('g');
    this.selections.caption.append('rect')
      .attr('width', '140')
      .attr('height', '0')
      // .attr('rx', '10')
      // .attr('ry', '10')
      .attr('class', 'caption');

    this.updateData()
    this.zoom.scaleBy(svg, 0.7);
  },

  created() {
    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink())
      // .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide())
      .force("center", d3.forceCenter())
      // .force("forceX", d3.forceX())
      // .force("forceY", d3.forceY())
      .on("tick", this.tick)
    // Call first time to setup default values
    this.updateForces()
  },

  watch: {
    data: {
      handler(newData) {
        this.updateData()
      },
      deep: true
    },
    forceProperties: {
      handler(newForce) {
        this.updateForces()
      },
      deep: true
    }
  }
};
</script>

<style lang="less">
  .faded {
    opacity: 0.1;
    transition: 0.3s opacity;
  }
  .highlight {
    opacity: 1;
  }
  path.link {
    fill: none;
    stroke: #666;
    stroke-width: 1.5px;
  }
  path.link.depends {
    stroke: #005900;
    stroke-dasharray: 5, 2;
  }
  path.link.needs {
    stroke: #7f3f00;
  }
  .ref-node circle {
    cursor: pointer;
    fill: #ffff99;
    stroke: #191900;
    stroke-width: 1.5px;
  }
  .ref-node circle.in {
    fill: #cce5ff;
    stroke: #003366;
  }
  .ref-node circle.out {
    fill: #ffe5e5;
    stroke: #660000;
  }
  .ref-node circle.init {
    fill: #b2e8b2;
    stroke: #001900;
  }
  .ref-node circle.selected {
    stroke: #ff6666FF !important;
    stroke-width: 3px;
    animation: selected 2s infinite alternate ease-in-out;
  }

  .ref-type {
    fill: #ffff99;
    stroke: #191900;
    stroke-width: 1.5px;
  }
  .ref-type.in {
    fill: #cce5ff;
    stroke: #003366;
  }
  .ref-type.out {
    fill: #ffe5e5;
    stroke: #660000;
  }

  @keyframes selected {
    from {
      stroke-width: 5px;
      r: 26;
    }
    to {
      stroke-width: 1px;
      r: 30;
    }
  }
  text {
    font: 10px sans-serif;
    /* pointer-events: all; */
    /* pointer-events: auto; */
    /* pointer-events: fill; */

    text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
  }
  rect.caption {
    fill: #efefef;
    // stroke: #666;
    // stroke-width: 1px;
  }
  text.caption {
    font-size: 14px;
    font-weight: bold;
  }

  .ref-info {

  }

  .ref-org-logo {
    cursor: pointer;
  }

  .ref-info-box {
    background-color: #ffffff;
    border: 1.2px solid black;
    padding: 0px 0px 10px 0px;
  }


  .ref-info-hash-box {
    background-color: #f5f2f2;
    border-bottom: 1.2px solid black;
    padding: 5px 10px 5px 10px;
  }
  .ref-info-hash-algo {
    color: grey;
    font-weight: 500;
    font-size: 14px;
  }
  .ref-info-hash-value {
    font-size: 12px;
    padding-left: 7px;
    font-weight: 400;
    // word-break: break-all;
  }


  .ref-info-title-box {
    padding: 15px 10px 5px 10px;
  }
  .ref-info-title-link {

  }


  .ref-info-authors-label {

  }
  .ref-info-authors-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ref-info-authors-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px 10px;
  }

  .ref-info-author {
    display: flex;
    align-items: center;
  }
  .ref-info-author-img {
    height: 30px;
    width: 30px;
  }
  .ref-info-author-name {
    padding: 0px 10px 0px 10px;
  }


  .ref-info-org-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px 10px;
  }
  .ref-info-org-label {

  }
  .ref-info-org-content {

  }
  .ref-info-org {
    display: flex;
    align-items: center;
  }
  .ref-info-org-logo {
    width: 30px;
    height: 30px;
  }
  .ref-info-org-name {
    padding: 0px 10px 0px 10px;
  }


  .ref-info-access-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px 10px;
  }
  .ref-info-access-label {

  }
  .ref-info-access-content {

  }
  .ref-info-access {
    display: flex;
    align-items: center;
  }
  .ref-info-access-icon {
    height: 30px;
    width: 30px;
  }
  .ref-info-access-text {
    padding: 0px 10px 0px 10px;
  }


  .ref-info-datetime-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px 10px;
  }
  .ref-info-datetime-label {

  }
  .ref-info-datetime-content {

  }
  .ref-info-datetime {
    display: flex;
    align-items: center;
  }
  .ref-info-datetime-text {
    padding: 0px 10px 0px 10px;
  }

  .ref-title {
    font-size: 9px
  }

</style>
